var Car = artifacts.require('./Car');
var CarNetwork = artifacts.require('./CarNetwork');
var CarMarket = artifacts.require('./CarMarket');
var assert = require("chai").assert;
var truffleAssert = require('truffle-assertions');

contract('CarMarket', function (accounts) {
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
    const price1 = 90000;
    const price2 = 60000;
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

    before(async () => {
        carNetworkInstance = await CarNetwork.new(carNetworkHostAddress);
        carInstance = await Car.new(carNetworkInstance.address);
        carMarketInstance = await CarMarket.new(carInstance.address);
        await registerManufacturer();
        await createCar1();
        await transferCar(vin1, manufacturerAddress, ownerAddress);
    });

    it("List car should fail if price <= 0", async () => {
        await truffleAssert.reverts(
            carMarketInstance.list(vin1, 0, {
                from: ownerAddress
            }),
            "Price must be > 0"
        );
    });
    /*
        it("List car should fail if caller is not current owner", async () => {
            await truffleAssert.reverts(
                carMarketInstance.list(vin1, 0, {
                    from: manufacturerAddress
                }),
                "Require car's current owner"
            );
        });
    */
    it("List car should fail if vin does not exist", async () => {
        await truffleAssert.reverts(
            carMarketInstance.list(vin2, 0, {
                from: manufacturerAddress
            }),
            "Vin number does not exist"
        );
    });

    it("List car should work", async () => {
        var result = await carMarketInstance.list(vin1, price1, {
            from: ownerAddress
        });
        truffleAssert.eventEmitted(result, 'listCar', (ev) => {
            return (ev.vin == vin1);
        });
    });

    it("Get all listed cars should work", async () => {
        await createCar2();
        await carMarketInstance.list(vin2, price2, {
            from: manufacturerAddress
        });
        var result = await carMarketInstance.getAllListedCars({
            from: accounts[9]
        });
        var arr = [["", vin1, price1.toString()], ["", vin2, price2.toString()]]
        for (var i = 0; i < result.length; i++){
            assert.sameOrderedMembers(
                result[i],
                arr[i],
                'Listed cars does not match'
            );
        }

    });
    /*
        it("Unlist car should fail if caller is not current owner", async () => {
            await truffleAssert.reverts(
                carMarketInstance.unlist(vin1,{
                    from: manufacturerAddress
                }),
                "Require car's current owner"
            );
            var result = await carMarketInstance.unlist(vin1, price1, {
                from: ownerAddress
            });
            truffleAssert.eventNotEmitted(result, 'unlistCar', (ev) => {
                return (ev.vin == vin1);
            });
        });
    */
    it("Unlist car should work", async () => {
        var result = await carMarketInstance.unlist(vin1, {
            from: ownerAddress
        });
        truffleAssert.eventEmitted(result, 'unlistCar', (ev) => {
            return (ev.vin == vin1);
        });
    });

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