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
    const vin1 = "WBAAL32040AZ13247";
    const vin2 = "WBAWL72030PZ84188";
    const carModel1 = "Mercedes-Benz GLA180";
    const carModel2 = "BMW 318i";
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
        batchNo: "batch 000", comment: "create car, add light"
    };
    const newCarPartList1 = [
        newCarPartServiceRecord1, newCarPartServiceRecord2, newCarPartServiceRecord3
    ];
    // #endregion

    beforeEach(async () => {
        carNetworkInstance = await CarNetwork.new(carNetworkHostAddress);
        carInstance = await Car.new(carNetworkInstance.address);
    });
/*
    it("Create car should work ", async () => {
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
        await transferCar(vin1, manufacturerAddress, ownerAddress);
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

    it("Get manufactured car list from manufacturer address after ownership transfer should work", async () => {
        await registerManufacturer();
        await createCar1();
        await createCar2();
        await transferCar(vin1, manufacturerAddress, ownerAddress);
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
*/
});