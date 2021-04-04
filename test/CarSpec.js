var Car = artifacts.require('./Car');
var CarNetwork = artifacts.require('./CarNetwork');
var CarMarket = artifacts.require('./CarMarket');
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
    // #endregion
    // #region Fake car details
    const vin1 = "WBAAL32040AZ13247";
    const vin2 = "WBAWL72030PZ84188";
    const vin3 = "A2222";
    const carModel1 = "Mercedes-Benz GLA180";
    const carModel2 = "BMW 318i";
    const vinList1 = [vin1, vin2];
    const vinList2 = [vin1, vin2, vin3];
    const newCarServiceRecord1 = {
        createdBy: manufacturerAddress,
        createdOn: "2021-03-01 11:26:24",
        comment: "create car, and whatever else comment is to be added by the manufacturer"
    };
    const serviceRecord1 = {
        createdBy: workshopAddress1,
        createdOn: "2021-03-20 15:39:57",
        comment: "This comment is created workshopAddress1. serviceRecord1. Any text goes here"
    };
    const serviceRecord2 = {
        createdBy: workshopAddress1,
        createdOn: "2021-04-01 12:08:44",
        comment: "This comment is created workshopAddress1. serviceRecord2. Any text goes here"
    };
    const newCarServiceRecord1Response = [
        newCarServiceRecord1.createdBy, newCarServiceRecord1.createdOn, newCarServiceRecord1.comment];
    const serviceRecord1Response = [
        serviceRecord1.createdBy, serviceRecord1.createdOn, serviceRecord1.comment];
    const serviceRecord2Response = [
        serviceRecord2.createdBy, serviceRecord2.createdOn, serviceRecord2.comment];
    const serviceRecordResponseList1 = [
        newCarServiceRecord1Response, serviceRecord1Response, serviceRecord2Response];
    const serviceRecordResponseList2 = [
        newCarServiceRecord1Response, serviceRecord1Response];
    // #endregion

    beforeEach(async () => {
        carNetworkInstance = await CarNetwork.new(carNetworkHostAddress);
        carInstance = await Car.new(carNetworkInstance.address);
    });

    it("Create one car should work", async () => {
        await registerManufacturer();

        var result1 = await carInstance.createCar(vin1, carModel1, newCarServiceRecord1, {
                from: manufacturerAddress
            });
        truffleAssert.eventEmitted(result1, 'CreateCar', (ev) => {
            return (ev.vin == vin1 &&
                ev.carModel == carModel1 &&
                ev.manufacturer == manufacturerAddress &&
                ev.numOwner == 1);
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
                ev.manufacturer == manufacturerAddress &&
                ev.numOwner == 1);
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin2 &&
                ev.sr.createdBy == newCarServiceRecord1.createdBy &&
                ev.sr.createdOn == newCarServiceRecord1.createdOn &&
                ev.sr.comment == newCarServiceRecord1.comment);
        });
    });

    it("Create car should fail from non-manufacturer", async () => {
        await registerOwner1();

        await truffleAssert.reverts(
            carInstance.createCar(vin1, carModel1, newCarServiceRecord1,{
                    from: ownerAddress1
                }),
                "This action can only be performed by specified permissioned roles."
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
            "VIN number does not exist."
        );
    });

    it("Transfer car should fail when not called by current owner", async () => {
        await registerManufacturer();
        await createCar1();
        await registerOwner1();

        await truffleAssert.reverts(
            carInstance.transferCar(vin1, ownerAddress1, {
                from: ownerAddress2
            }),
            "This action can only be performed by the car's current owner."
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
            "This action can only be performed by the car's current owner."
        );
    });

    it("Auth workshop should work", async () => {
        await registerManufacturer();
        await createCar1();
        await registerWorkshop();

        var result1 = await carInstance.authWorkshop(vin1, workshopAddress1, {
            from: manufacturerAddress
        });
        truffleAssert.eventEmitted(result1, 'AuthWorkshop', (ev) => {
            return (ev.vin == vin1 &&
                ev.workshop == workshopAddress1 &&
                ev.auth == true);
        });
    });

    it("Auth workshop should fail when already auth-ed", async () => {
        await registerManufacturer();
        await createCar1();
        await registerWorkshop();
        await authWorkshop(vin1, manufacturerAddress, workshopAddress1);

        await truffleAssert.reverts(
            carInstance.authWorkshop(vin1, workshopAddress1, {
                from: manufacturerAddress
            }),
            "Car already authorised to a workshop."
        );
    });

    it("Unauth workshop should work", async () => {
        await registerManufacturer();
        await createCar1();
        await registerWorkshop();
        await authWorkshop(vin1, manufacturerAddress, workshopAddress1);
      
        var result1 = await carInstance.unAuthWorkshop(vin1, {
            from: manufacturerAddress
        });
        truffleAssert.eventEmitted(result1, 'UnauthWorkshop', (ev) => {
            return (ev.vin == vin1 &&
                ev.auth == false);
        });
    });

    it("Unauth workshop should fail when no workshop auth-ed", async () => {
        await registerManufacturer();
        await createCar1();
        await registerWorkshop();

        await truffleAssert.reverts(
            carInstance.unAuthWorkshop(vin1, {
                from: manufacturerAddress
            }),
            "Car is not authorised to any workshop."
        );
    });

    it("Get auth workshop should work", async () => {
        await registerManufacturer();
        await createCar1();
        await registerWorkshop();
        await authWorkshop(vin1, manufacturerAddress, workshopAddress1);
      
        var result1 = await carInstance.getAuthWorkshop(vin1, {
            from: manufacturerAddress
        });
        assert.strictEqual(result1, workshopAddress1, "auth workshop address did not match");
    });

    it("Get auth workshop should fail no workshop auth-ed", async () => {
        await registerManufacturer();
        await createCar1();
        await registerWorkshop();
    
        await truffleAssert.reverts(
            carInstance.getAuthWorkshop(vin1, {
                from: manufacturerAddress
            }),
            "Car is not authorised to any workshop."
        );
    });

    it("Workshop add service record should work", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar1();
        await authWorkshop(vin1, manufacturerAddress, workshopAddress1);

        var result1 = await carInstance.addServiceRecord(vin1, serviceRecord1, {
            from: workshopAddress1
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin1 &&
                ev.sr.createdBy == serviceRecord1.createdBy &&
                ev.sr.createdOn == serviceRecord1.createdOn &&
                ev.sr.comment == serviceRecord1.comment);
        });
        truffleAssert.eventEmitted(result1, 'UnauthWorkshop', (ev) => {
            return (ev.vin == vin1 &&
                ev.auth == false);
        });
    });

    it("Add service records should fail when not auth-ed", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar1();

        await truffleAssert.reverts(
            carInstance.addServiceRecord(vin1, serviceRecord1, {
                from: workshopAddress1
            }),
            "This workshop is not authorised to add a service record to this car."
        );
    });

    it("Get car list from owner address should work", async () => {
        await registerManufacturer();
        await createCar1();
        await createCar2();

        var result = await carInstance.getOwnedCarsList({
            from: manufacturerAddress
        });
        assert.deepEqual(result[0],
            [carModel1, vin1],
            "Does not match owner's currently owned car"
        );
        assert.deepEqual(result[1],
            [carModel2, vin2],
            "Does not match owner's currently owned car"
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
        assert.deepEqual(result[0],
            [carModel1, vin1],
            "Does not match owner's currently owned car"
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
        assert.deepEqual(result1[0],
            [carModel2, vin2],
            "Does not match manufacturer's previously manufactured car"
        );
        assert.strictEqual(result1.length,
            1,
            "Does not match manufacturer's previously manufactured car"
        );

        var result2 = await carInstance.getOwnedCarsList({
            from: ownerAddress1
        });
        assert.deepEqual(result2[0],
            [carModel1, vin1],
            "Does not match manufacturer's previously manufactured car"
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
            "This action can only be performed by specified permissioned roles."
        );
    });

    it("getCarServiceRecordByVin should work", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar1();
        await authWorkshop(vin1, manufacturerAddress, workshopAddress1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord2);

        var result = await carInstance.getCarServiceRecordByVin(vin1,{
            from: workshopAddress1
        });
        assert.deepEqual(result[0], newCarServiceRecord1Response, "serviceRecord doesn't match");
        assert.deepEqual(result[1], serviceRecord1Response, "serviceRecord doesn't match");
        assert.deepEqual(result[2], serviceRecord2Response, "serviceRecord doesn't match");
        assert.strictEqual(result.length, 3, "Number of service record return doesn't match");
    });

    it("getCarByVin should work", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar2();
        await createCar1();
        await authWorkshop(vin1, manufacturerAddress, workshopAddress1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord2);
        await registerOwner1();
        await transferCar(vin1, manufacturerAddress, ownerAddress1);

        var result = await carInstance.getCarByVin(vin1, {
            from: ownerAddress1
        });
        //console.log(result);
        assert.strictEqual(result[0], vin1, "Did not return correct vin");
        assert.strictEqual(result[1], carModel1, "Did not return correct model");
        assert.deepEqual(result[2], [manufacturerAddress, ownerAddress1], "Did not return correct ownersList");
        assert.strictEqual(result[4], ownerAddress1, "Did not return correct currOwner");
        assert.deepEqual(result[3], serviceRecordResponseList1, "Did not return correct serviceRecords")
    });

    it("getCarByVin should work when called by CarMarket", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar2();
        await createCar1();
        await authWorkshop(vin1, manufacturerAddress, workshopAddress1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord2);
        var carMarketInstance = await CarMarket.new(carInstance.address);

        var result = await carInstance.getCarByVin(vin1, {
            from: carMarketInstance.address
        });
        assert.strictEqual(result[0], vin1, "Did not return correct vin");
        assert.strictEqual(result[1], carModel1, "Did not return correct model");
        assert.deepEqual(result[2], [manufacturerAddress], "Did not return correct ownersList");
        assert.strictEqual(result[4], manufacturerAddress, "Did not return correct currOwner");
        assert.deepEqual(result[3], serviceRecordResponseList1, "Did not return correct serviceRecords")
    });

    it("getCarByVin should fail when car doesnt exist", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar2();
        await createCar1();
        await authWorkshop(vin1, manufacturerAddress, workshopAddress1);
        await addServiceRecord(vin1, workshopAddress1, serviceRecord1);

        await truffleAssert.reverts(
            carInstance.getCarByVin(vin3, {
                from: workshopAddress1
            }),
            "VIN number does not exist."
        );
    });

    it("getCarByVin should fail when called by non-registered", async () => {
        await registerManufacturer();
        await createCar1();

        await truffleAssert.reverts(
            carInstance.getCarByVin(vin1, {
                from: ownerAddress1
            }),
            "User not registered in system."
        );
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
    async function registerWorkshop() {
        await carNetworkInstance.register(workshopAddress1, "Workshop", {
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
    async function authWorkshop(vin, from, workshop) {
        await carInstance.authWorkshop(vin, workshop, {
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