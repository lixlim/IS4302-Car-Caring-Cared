var Car = artifacts.require('./Car');
var CarNetwork = artifacts.require('./CarNetwork');
var assert = require("chai").assert;
var truffleAssert = require('truffle-assertions');

contract('Car', function (accounts) {
    var carInstance;
    // #region Fake accounts 
    var carNetworkHostAddress = accounts[0];
    var ownerAddress1 = accounts[1];
    var ownerAddress2 = accounts[2];
    var ownerAddress3 = accounts[3];
    var manufacturerAddress = accounts[4];
    var dealerAddress1 = accounts[6];
    var workshopAddress1 = accounts[8];
    var workshopAddress2 = accounts[9];
    // #endregion
    // #region Fake car details
    const vin1 = "WBAAL32040AZ13247";
    const vin2 = "WBAWL72030PZ84188";
    const vin3 = "A2222";
    const carModel1 = "Mercedes-Benz GLA180";
    const carModel2 = "BMW 318i";
    const vinList1 = [vin1 , vin2];
    const vinList2 = [vin1 , vin2, vin3];
    const newCarServiceRecord1 = {
        createdBy: manufacturerAddress,
        createdOn: "01/01/21",
        comment: "create car, and whatever else comment is to be added by the manufacturer"
    };
    const serviceRecord1 = {
        createdBy: workshopAddress1,
        createdOn: "02/02/21",
        comment: "This comment is created workshopAddress1. serviceRecord1. Any text goes here"
    };
    const serviceRecord2 = {
        createdBy: workshopAddress1,
        createdOn: "03/03/21",
        comment: "This comment is created workshopAddress1. serviceRecord2. Any text goes here"
    };
    // #endregion

    beforeEach(async () => {
        carNetworkInstance = await CarNetwork.new(carNetworkHostAddress);
        carInstance = await Car.new(carNetworkInstance.address);
    });

    it("Create car should work", async () => {
        await registerManufacturer();

        var result1 = await carInstance.createCar(vin1, carModel1, newCarServiceRecord1, {
                from: manufacturerAddress
            });
        truffleAssert.eventEmitted(result1, 'CreateCar', (ev) => {
            return (ev.vin == vin1 &&
                ev.carModel == carModel1 &&
                ev.manufacturer == manufacturerAddress);
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin1 &&
                ev.sr.createdBy == newCarServiceRecord1.createdBy &&
                ev.sr.createdOn == newCarServiceRecord1.createdOn &&
                ev.sr.comment == newCarServiceRecord1.comment);
        });
    });

    it("Create second car should work", async () => {
        await registerManufacturer();
        await createCar1();

        var result1 = await carInstance.createCar(vin2, carModel2, newCarServiceRecord1, {
                from: manufacturerAddress
            });
        truffleAssert.eventEmitted(result1, 'CreateCar', (ev) => {
            return (ev.vin == vin2 &&
                ev.carModel == carModel2 &&
                ev.manufacturer == manufacturerAddress);
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin2 &&
                ev.sr.createdBy == newCarServiceRecord1.createdBy &&
                ev.sr.createdOn == newCarServiceRecord1.createdOn &&
                ev.sr.comment == newCarServiceRecord1.comment);
        });
        var result = await carInstance.getCar(vin2);
        assert.deepEqual(result[2], [manufacturerAddress], "Did not return correct ownersList for second car");
    });

    it("Create car should fail from non-manufacturer", async () => {
        await registerOwner1();

        await truffleAssert.reverts(
            carInstance.createCar(vin1, carModel1, newCarServiceRecord1,{
                    from: ownerAddress1
                }),
            "You do not have the access right"
        );
    });

    it("Transfer car should work", async () => {
        await registerManufacturer();
        await registerOwner1();
        await createCar1();

        var result1 = await carInstance.transferCar(vin1, ownerAddress1, {
            from: manufacturerAddress
        });
        truffleAssert.eventEmitted(result1, 'TransferCar', (ev) => {
            return (ev.vin == vin1 &&
                ev.prevOwner == manufacturerAddress &&
                ev.currOwner == ownerAddress1);
        });
    });

    it("Transfer car should fail when car doesn't exist", async () => {
        await registerManufacturer();
        await registerOwner1();

        await truffleAssert.reverts(
            carInstance.transferCar(vin1, ownerAddress1, {
                from: manufacturerAddress
            }),
            "Vin number does not exist"
        );
    });

    it("Transfer car should fail when call not current owner", async () => {
        await registerManufacturer();
        await createCar1();
        await registerOwner1();

        await truffleAssert.reverts(
            carInstance.transferCar(vin1, ownerAddress1, {
                from: ownerAddress2
            }),
            "Require car's current owner"
        );
    });

    it("Transfer car should fail when transfering to non-registered", async () => {
        await registerManufacturer();
        await createCar1();
        await registerOwner1();

        await truffleAssert.reverts(
            carInstance.transferCar(vin1, ownerAddress2, {
                from: ownerAddress1
            }),
            "Require car's current owner"
        );
    });

    it("Workshop add service record should work", async () => {
        await registerManufacturer();
        await registerWorkshop1();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, workshopAddress1);

        var result1 = await carInstance.addServiceRecord(vin1, serviceRecord1, {
            from: workshopAddress1
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin1 &&
                ev.sr.createdBy == serviceRecord1.createdBy &&
                ev.sr.createdOn == serviceRecord1.createdOn &&
                ev.sr.comment == serviceRecord1.comment);
        });
    });

    it("Add service records should fail when not called by workshop", async () => {
        await registerManufacturer();
        await registerOwner1();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, ownerAddress1);

        await truffleAssert.reverts(
            carInstance.addServiceRecord(vin1, serviceRecord1, {
                from: ownerAddress1
            }),
            "You do not have the access right"
        );
    });

    it("Add service records should fail when car not owned by workshop", async () => {
        await registerManufacturer();
        await registerWorkshop1();
        await createCar1();
 
        await truffleAssert.reverts(
            carInstance.addServiceRecord(vin1, serviceRecord1, {
                from: workshopAddress1
            }),
            "Require car's current owner"
        );
    });

    it("Get car list from owner address should work", async () => {
        await registerManufacturer();
        await createCar1();
        await createCar2();

        var result = await carInstance.getOwnedCarsList({
            from: manufacturerAddress
        });
        assert.strictEqual(result[0][0],
            carModel1,
            "Does not match owner's currently owned car model"
        );
        assert.strictEqual(result[0][1],
            vin1,
            "Does not match owner's currently owned car vin"
        );
        assert.strictEqual(result[1][0],
            carModel2,
            "Does not match owner's currently owned car model"
        );
        assert.strictEqual(result[1][1],
            vin2,
            "Does not match owner's currently owned car vin"
        );
        assert.strictEqual(result.length,
            2,
            "Number of cars return doesn't match"
        );
    });

    it("Get car list from owner address after ownership transfer should work", async () => {
        await registerManufacturer();
        await registerOwner1();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, ownerAddress1);

        var result = await carInstance.getOwnedCarsList({
            from: ownerAddress1
        });
        assert.strictEqual(result[0][0],
            carModel1,
            "Does not match owner's currently owned car model"
        );
        assert.strictEqual(result[0][1],
            vin1,
            "Does not match owner's currently owned car vin"
        );
        assert.strictEqual(result.length,
            1,
            "Number of cars return doesn't match"
        );

        var result = await carInstance.getOwnedCarsList({
            from: manufacturerAddress
        });
        assert.isEmpty(result,
            "Does not match owner's currently owned cars"
        )
    });

    it("Get manufactured car list from manufacturer address after ownership transfer should work", async () => {
        await registerManufacturer();
        await registerOwner1();
        await createCar1();
        await createCar2();
        await transferCar(vin1, manufacturerAddress, ownerAddress1);

        var result1 = await carInstance.getOwnedCarsList({
            from: manufacturerAddress
        });
        assert.strictEqual(result1[0][0],
            carModel2,
            "Does not match manufacturer's previously manufactured car model"
        );
        assert.strictEqual(result1[0][1],
            vin2,
            "Does not match manufacturer's previously manufactured car vin"
        );
        assert.strictEqual(result1.length,
            1,
            "Number of cars return doesn't match"
        );

        var result2 = await carInstance.getOwnedCarsList({
            from: ownerAddress1
        });
        assert.strictEqual(result2[0][0],
            carModel1,
            "Does not match manufacturer's previously manufactured car model"
        );
        assert.strictEqual(result2[0][1],
            vin1,
            "Does not match manufacturer's previously manufactured car vin"
        );
        assert.strictEqual(result2.length,
            1,
            "Number of cars return doesn't match"
        );
    });

    it("getManufacturedCarsList should work", async () => {
        await registerManufacturer();
        await createCar1();
        await createCar2();
        
        var result = await carInstance.getManufacturedCarsList({
            from: manufacturerAddress
        });
        assert.deepEqual(result[0],
            [carModel1, vin1],
            "Does not match manufacturer's previously manufactured car details"
        );
        assert.deepEqual(result[1],
            [carModel2, vin2],
            "Does not match manufacturer's previously manufactured car details"
        );
        assert.strictEqual(result.length,
            2,
            "Number of cars return doesn't match"
        );
    });

    it("getManufacturedCarsList should work after transfer", async () => {
        await registerManufacturer();
        await registerOwner1();
        await createCar1();
        await createCar2();
        await transferCar(vin1, manufacturerAddress, ownerAddress1);
        
        var result = await carInstance.getManufacturedCarsList({
            from: manufacturerAddress
        });
        assert.deepEqual(result[0],
            [carModel1, vin1],
            "Does not match manufacturer's previously manufactured car details"
        );
        assert.deepEqual(result[1],
            [carModel2, vin2],
            "Does not match manufacturer's previously manufactured car details"
        );
        assert.strictEqual(result.length,
            2,
            "Number of cars return doesn't match"
        );
    });

    it("getManufacturedCarsList should fail when called by non-manufactuer", async () => {
        await registerManufacturer();
        await registerOwner1();
        await createCar1();
        await createCar2();

        await truffleAssert.reverts(
            carInstance.getManufacturedCarsList( {
                from: ownerAddress1
            }),
            "You do not have the access right"
        );
    });

    it("getCarsByVinList should work", async () => {
        await registerManufacturer();
        await registerOwner1();
        await createCar1();
        await createCar2();

        var result = await carInstance.getCarsByVinList(vinList1,{
            from: ownerAddress1
        });
        assert.deepEqual(result[0],
            [carModel1, vin1],
            "Does not match manufacturer's previously manufactured car details"
        );
        assert.deepEqual(result[1],
            [carModel2, vin2],
            "Does not match manufacturer's previously manufactured car details"
        );
        assert.strictEqual(result.length,
            2,
            "Number of cars return doesn't match"
        );
    });

    it("getCarsByVinList should work with some wrong vin", async () => {
        await registerManufacturer();
        await registerOwner1();
        await createCar1();
        await createCar2();

        var result = await carInstance.getCarsByVinList(vinList2,{
            from: ownerAddress1
        });
        assert.deepEqual(result[0],
            [carModel1, vin1],
            "Does not match manufacturer's previously manufactured car details"
        );
        assert.deepEqual(result[1],
            [carModel2, vin2],
            "Does not match manufacturer's previously manufactured car details"
        );
        assert.strictEqual(result.length,
            2,
            "Number of cars return doesn't match"
        );
    });

    it("getCarServiceRecordByVin should work", async () => {
        await registerManufacturer();
        await registerWorkshop1();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, workshopAddress1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord2);

        var result = await carInstance.getCarServiceRecordByVin(vin1,{
            from: workshopAddress1
        });
        assert.deepEqual(result[0],
            [newCarServiceRecord1.createdBy, newCarServiceRecord1.createdOn, newCarServiceRecord1.comment],
            "serviceRecord doesn't match"
        );
        assert.deepEqual(result[1],
            [serviceRecord1.createdBy, serviceRecord1.createdOn, serviceRecord1.comment],
            "serviceRecord doesn't match"
        );
        assert.deepEqual(result[2],
            [serviceRecord2.createdBy, serviceRecord2.createdOn, serviceRecord2.comment],
            "serviceRecord doesn't match"
        );
        assert.strictEqual(result.length,
            3,
            "Number of service record return doesn't match"
        );
    });

    it("getCar should work", async () => {
        await registerManufacturer();
        await registerWorkshop1();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, workshopAddress1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord2);

        var result = await carInstance.getCar(vin1,{
            from: ownerAddress1
        });
        //console.log(result);
        arr = [
            [
              manufacturerAddress.toString(),
              '01/01/21',
              'create car, and whatever else comment is to be added by the manufacturer'
            ],
            [
              workshopAddress1.toString(),
              '02/02/21',
              'This comment is created workshopAddress1. serviceRecord1. Any text goes here'
            ],
            [
              workshopAddress1.toString(),
              '03/03/21',
              'This comment is created workshopAddress1. serviceRecord2. Any text goes here'
            ]
        ]
        assert.strictEqual(result[0], vin1, "Did not return correct vin");
        assert.strictEqual(result[1], carModel1, "Did not return correct model");
        assert.deepEqual(result[2], [manufacturerAddress, workshopAddress1], "Did not return correct ownersList");
        assert.strictEqual(result[4], workshopAddress1, "Did not return correct currOwner");
        for (var i = 0; i < result[3].length; i++) {
            assert.deepEqual(
                result[3][i],
                arr[i],
                'Did not return correct serviceRecords'
            );
        } 
    });

    // #region Helper methods
    async function registerOwner1() {
        await carNetworkInstance.register(ownerAddress1, "Owner", {
            from: carNetworkHostAddress
        });
    };
    async function registerOwner2() {
        await carNetworkInstance.register(ownerAddress2, "Owner", {
            from: carNetworkHostAddress
        });
    };
    async function registerOwner3() {
        await carNetworkInstance.register(ownerAddress3, "Owner", {
            from: carNetworkHostAddress
        });
    };
    async function registerManufacturer() {
        await carNetworkInstance.register(manufacturerAddress, "Manufacturer", {
            from: carNetworkHostAddress
        });
    };
    async function registerDealer() {
        await carNetworkInstance.register(dealerAddress1, "Dealer", {
            from: carNetworkHostAddress
        });
    };
    async function registerWorkshop1() {
        await carNetworkInstance.register(workshopAddress1, "Workshop", {
            from: carNetworkHostAddress
        });
    };
    async function registerWorkshop2() {
        await carNetworkInstance.register(workshopAddress2, "Workshop", {
            from: carNetworkHostAddress
        });
    };
    async function createCar1() {
        await carInstance.createCar(vin1, carModel1, newCarServiceRecord1, {
            from: manufacturerAddress
        });
    }
    async function createCar2() {
        await carInstance.createCar(vin2, carModel2, newCarServiceRecord1, {
            from: manufacturerAddress
        });
    }
    async function transferCar(vin, from, to) {
        await carInstance.transferCar(vin, to, {
            from: from
        })
    }
    async function addServiceRecord(vin, from, serviceRecord){
        await carInstance.addServiceRecord(vin, serviceRecord, {
            from: from
        })
    }
    //#endregion
});