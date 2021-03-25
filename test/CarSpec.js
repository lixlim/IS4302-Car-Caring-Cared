var Car = artifacts.require('./Car');
var CarNetwork = artifacts.require('./CarNetwork');
var assert = require("chai").assert;
var truffleAssert = require('truffle-assertions');

contract('Car', function (accounts) {
    var carInstance;
    // #region Fake accounts 
    var carNetworkHostAddress = accounts[0];
    var ownerAddress = accounts[1];
    var manufacturerAddress = accounts[2];
    var dealerAddress = accounts[3];
    var workshopAddress = accounts[4];
    // #endregion
    // #region Fake car details
    const vin1 = "A0000";
    const vin2 = "A1111";
    const carModel1 = "fakeCarModel111";
    const carModel2 = "fakeCarModel222";
    const newCarPartServiceRecord1 = {
        createdBy: manufacturerAddress,
        createdOn: "01/01/21", carPart: "Engine", model: "model AAA",
        batchNo: "batch 000", comment: "create car, add engine"
    };
    const newCarPartServiceRecord2 = {
        createdBy: manufacturerAddress,
        createdOn: "01/01/21", carPart: "Wheel", model: "model BBB",
        batchNo: "batch 000", comment: "create car, add wheel"
    };
    const newCarPartServiceRecord3 = {
        createdBy: manufacturerAddress,
        createdOn: "01/01/21", carPart: "Light", model: "model CCC",
        batchNo: "batch 000", comment: "create car, add left light"
    };
    const newCarPartServiceRecord4 = {
        createdBy: manufacturerAddress,
        createdOn: "01/01/21", carPart: "Light", model: "model DDD",
        batchNo: "batch 000", comment: "create car, add right light"
    };
    const newCarPartServiceRecord5 = {
        createdBy: manufacturerAddress,
        createdOn: "02/02/21", carPart: "Light", model: "model DDD",
        batchNo: "batch 234", comment: "replaced the previous faulty lights"
    };
    const newCarPartServiceRecord6 = {
        createdBy: manufacturerAddress,
        createdOn: "02/02/21", carPart: "Sound System", model: "model KKK",
        batchNo: "batch 345", comment: "Added in a new car audio system"
    };
    const newCarPartServiceRecord7 = {
        createdBy: manufacturerAddress,
        createdOn: "02/02/21", carPart: "Spoiler", model: "model 432534F",
        batchNo: "batch 4D5", comment: "Added in a new car spoiler"
    };
    const newCarPartServiceRecord8 = {
        createdBy: manufacturerAddress,
        createdOn: "03/03/21", carPart: "Engine", model: "model d432",
        batchNo: "batch 99", comment: "Car crashed, replace engine"
    };
    const newCarPartServiceRecord9 = {
        createdBy: manufacturerAddress,
        createdOn: "03/03/21", carPart: "Wheel", model: "model vf2312",
        batchNo: "batch 99", comment: "Car crashed, replace wheel"
    };
    const newCarPartList1 = [
        newCarPartServiceRecord1, newCarPartServiceRecord2, newCarPartServiceRecord3
    ];
    const newCarPartList2 = [
        newCarPartServiceRecord3, newCarPartServiceRecord4
    ];
    const serviceRecordList1 = [
        newCarPartServiceRecord6
    ]
    const serviceRecordList2 = [
        newCarPartServiceRecord6, newCarPartServiceRecord7
    ]
    const serviceRecordList3 = [
        newCarPartServiceRecord8, newCarPartServiceRecord9
    ]
    // #endregion

    beforeEach(async () => {
        carNetworkInstance = await CarNetwork.new(carNetworkHostAddress);
        carInstance = await Car.new(carNetworkInstance.address);
    });

    it("Create car should work, no repeated parts", async () => {
        await registerManufacturer();

        var result1 = await carInstance.createCar(vin1, carModel1, newCarPartList1, {
                from: manufacturerAddress
            });
        truffleAssert.eventEmitted(result1, 'CreateCar', (ev) => {
            return (ev.vin == vin1 &&
                ev.carModel == carModel1 &&
                ev.manufacturer == manufacturerAddress &&
                ev.numCarParts == newCarPartList1.length);
        });
    });

    it("Create car should work, with repeated parts", async () => {
        await registerManufacturer();

        var result1 = await carInstance.createCar(vin1, carModel1, newCarPartList2, {
                from: manufacturerAddress
            });
        truffleAssert.eventEmitted(result1, 'CreateCar', (ev) => {
            return (ev.vin == vin1 &&
                ev.carModel == carModel1 &&
                ev.manufacturer == manufacturerAddress &&
                ev.numCarParts == 1); // newCarPartList2
        });
    });

    it("Create car should fail from non-manufacturer", async () => {
        await registerOwner();

        await truffleAssert.reverts(
            carInstance.createCar(vin1, carModel1, newCarPartList1,{
                    from: ownerAddress
                }),
            "You do not have the access right"
        );
    });

    it("Transfer car should work", async () => {
        await registerManufacturer();
        await registerOwner();
        await createCar1();

        var result1 = await carInstance.transferCar(vin1, ownerAddress, {
            from: manufacturerAddress
        });
        truffleAssert.eventEmitted(result1, 'TransferCar', (ev) => {
            return (ev.vin == vin1 &&
                ev.prevOwner == manufacturerAddress &&
                ev.currOwner == ownerAddress);
        });
    });

    it("Transfer car should fail when car doesn't exist", async () => {
        await registerManufacturer();
        await registerOwner();

        await truffleAssert.reverts(
            carInstance.transferCar(vin1, ownerAddress, {
                from: manufacturerAddress
            }),
            "Vin number does not exist"
        );
    });

    it("Transfer car should fail when call not current owner", async () => {
        await registerManufacturer();
        await createCar1();
        await registerOwner();

        await truffleAssert.reverts(
            carInstance.transferCar(vin1, ownerAddress, {
                from: ownerAddress
            }),
            "Require car's current owner"
        );
    });

    it("Workshop add 1 service record, new car part", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, workshopAddress);

        var result1 = await carInstance.addServiceRecord(vin1, serviceRecordList1, {
            from: workshopAddress
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin1 &&
                ev.carPart == "Sound System" &&
                ev.numCarParts ==  newCarPartList1.length + serviceRecordList1.length);
        });
    });

    it("Workshop add 2 service records, both new car part", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, workshopAddress);

        var result1 = await carInstance.addServiceRecord(vin1, serviceRecordList2, {
            from: workshopAddress
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin1 &&
                ev.carPart == "Sound System" &&
                ev.numCarParts ==  newCarPartList1.length + serviceRecordList2.length - 1);
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin1 &&
                ev.carPart == "Spoiler" &&
                ev.numCarParts ==  newCarPartList1.length + serviceRecordList2.length);
        });
    });

    it("Workshop add 2 service records, both existing car part", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, workshopAddress);

        var result1 = await carInstance.addServiceRecord(vin1, serviceRecordList3, {
            from: workshopAddress
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin1 &&
                ev.carPart == "Engine" &&
                ev.numCarParts ==  newCarPartList1.length);
        });
        truffleAssert.eventEmitted(result1, 'AddServiceRecord', (ev) => {
            return (ev.vin == vin1 &&
                ev.carPart == "Wheel" &&
                ev.numCarParts ==  newCarPartList1.length);
        });
    });

    it("Add service records should fail, not called by workshop", async () => {
        await registerManufacturer();
        await registerOwner();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, ownerAddress);

        await truffleAssert.reverts(
            carInstance.addServiceRecord(vin1, serviceRecordList1, {
                from: ownerAddress
            }),
            "You do not have the access right"
        );
    });

    it("Add service records should fail, car not owned by workshop", async () => {
        await registerManufacturer();
        await registerWorkshop();
        await createCar1();
 
        await truffleAssert.reverts(
            carInstance.addServiceRecord(vin1, serviceRecordList1, {
                from: workshopAddress
            }),
            "Require car's current owner"
        );
    });


    it("Get car list from owner address should work", async () => {
        await registerManufacturer();
        await createCar1();
        var result = await carInstance.getCarsList({
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
    });

    it("Get car list from owner address after ownership transfer should work", async () => {
        await registerManufacturer();
        await createCar1();
        await carInstance.transferCar(vin1, ownerAddress, {
            from: manufacturerAddress
        });
        var result = await carInstance.getCarsList({
            from: ownerAddress
        });
        assert.strictEqual(result[0][0],
            carModel1,
            "Does not match owner's currently owned car model"
        );
        assert.strictEqual(result[0][1],
            vin1,
            "Does not match owner's currently owned car vin"
        );
        var result = await carInstance.getCarsList({
            from: manufacturerAddress
        });
        assert.isEmpty(result,
            "Does not match owner's currently owned cars"
        )
    });

    it("Get car list from owner address after ownership transfer should work", async () => {
        await registerManufacturer();
        await createCar1();
        await createCar2();
        await carInstance.transferCar(vin1, ownerAddress, {
            from: manufacturerAddress
        });
        var result = await carInstance.getManufacturedCarsList({
            from: manufacturerAddress
        });
        assert.strictEqual(result[0][0],
            carModel1,
            "Does not match manufacturer's previously manufactured car model"
        );
        assert.strictEqual(result[0][1],
            vin1,
            "Does not match manufacturer's previously manufactured car vin"
        );
        assert.strictEqual(result[1][0],
            carModel2,
            "Does not match manufacturer's previously manufactured car model"
        );
        assert.strictEqual(result[1][1],
            vin2,
            "Does not match manufacturer's previously manufactured car vin"
        );
    });

    // it("get car", async () => {
    //     await registerManufacturer();
    //     await createCar1();

    //     var result1 = await carInstance.getCar(vin1);
    //     console.log(result1);

    // });


    async function registerOwner() {
        await carNetworkInstance.register(ownerAddress, "Owner", {
            from: carNetworkHostAddress
        });
    };
    async function registerManufacturer() {
        await carNetworkInstance.register(manufacturerAddress, "Manufacturer", {
            from: carNetworkHostAddress
        });
    };
    async function registerDealer() {
        await carNetworkInstance.register(dealerAddress, "Dealer", {
            from: carNetworkHostAddress
        });
    };
    async function registerWorkshop() {
        await carNetworkInstance.register(workshopAddress, "Workshop", {
            from: carNetworkHostAddress
        });
    };

    async function createCar1() {
        await carInstance.createCar(vin1, carModel1, newCarPartList1, {
            from: manufacturerAddress
        });
    }

    async function createCar2() {
        await carInstance.createCar(vin2, carModel2, newCarPartList1, {
            from: manufacturerAddress
        });
    }

    async function transferCar(vin, from, to) {
        await carInstance.transferCar(vin, to, {
            from: from
        })
    }

});