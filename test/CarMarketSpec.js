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
    const newCarServiceRecord1 = {
        createdBy: manufacturerAddress,
        createdOn: "01/01/21",
        comment: "create car, and whatever else comment is to be added by the manufacturer"
    };
    // #endregion

    before(async () => {
        carNetworkInstance = await CarNetwork.new(carNetworkHostAddress);
        carInstance = await Car.new(carNetworkInstance.address);
        carMarketInstance = await CarMarket.new(carInstance.address);
        await registerManufacturer();
        await createCar1();
        await registerOwner();
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

    it("List car should fail if caller is not current owner", async () => {
        await truffleAssert.reverts(
            carMarketInstance.list(vin1, 0, {
                from: manufacturerAddress
            }),
            "Require car's current owner"
        );
    });

    it("List car should fail if vin does not exist", async () => {
        await truffleAssert.reverts(
            carMarketInstance.list(vin2, price1, {
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
        var arr = [
            [carModel1, vin1, price1.toString(), ownerAddress.toString()],
            [carModel2, vin2, price2.toString(), manufacturerAddress.toString()]
        ]
        for (var i = 0; i < result.length; i++) {
            assert.sameOrderedMembers(
                result[i],
                arr[i],
                'Listed cars does not match'
            );
        }

    });

    it("Unlist car should fail if caller is not current owner", async () => {
        await truffleAssert.reverts(
            carMarketInstance.unlist(vin1, {
                from: manufacturerAddress
            }),
            "Require car's current owner"
        );
    });

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

});