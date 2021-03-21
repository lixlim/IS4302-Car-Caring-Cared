var Car = artifacts.require('./Car');
var CarNetwork = artifacts.require('./CarNetwork');
var assert = require("chai").assert;
var truffleAssert = require('truffle-assertions');

contract('CarNetwork', function (accounts) {
    var carInstance;
    var carNetworkHostAddress = accounts[0];
    var ownerAddress = accounts[1];
    var manufacturerAddress = accounts[2];
    var dealerAddress = accounts[3];
    var workshopAddress = accounts[4];

    beforeEach(async () => {
        carNetworkInstance = await CarNetwork.new(carNetworkHostAddress);
        carInstance = await Car.new(carNetworkInstance.address);
    });

    it("Register new Owner should work ", async () => {
        var result1 = await carNetworkInstance.register(ownerAddress, "Owner", {
            from: carNetworkHostAddress
        });
        truffleAssert.eventEmitted(result1, 'Register', (ev) => {
            return (ev.newAddress == ownerAddress &&
                ev.role == "Owner");
        });
    });

    it("Register new Manufacturer should work ", async () => {
        var result1 = await carNetworkInstance.register(manufacturerAddress, "Manufacturer", {
            from: carNetworkHostAddress
        });
        truffleAssert.eventEmitted(result1, 'Register', (ev) => {
            return (ev.newAddress == manufacturerAddress &&
                ev.role == "Manufacturer");
        });
    });

    it("Register new Dealer should work ", async () => {
        var result1 = await carNetworkInstance.register(dealerAddress, "Dealer", {
            from: carNetworkHostAddress
        });
        truffleAssert.eventEmitted(result1, 'Register', (ev) => {
            return (ev.newAddress == dealerAddress &&
                ev.role == "Dealer");
        });
    });

    it("Register new Workshop should work ", async () => {
        var result1 = await carNetworkInstance.register(workshopAddress, "Workshop", {
            from: carNetworkHostAddress
        });
        truffleAssert.eventEmitted(result1, 'Register', (ev) => {
            return (ev.newAddress == workshopAddress &&
                ev.role == "Workshop");
        });
    });

    it("Register should fail from non-admin", async () => {
        await truffleAssert.reverts(
            carNetworkInstance.register(ownerAddress, "Owner", {
                from: ownerAddress
            }),
            "This action requires admin"
        );
    });

    it("Register should fail with repeated address", async () => {
        await carNetworkInstance.register(workshopAddress, "Workshop", {
            from: carNetworkHostAddress
        });
        await truffleAssert.reverts(
            carNetworkInstance.register(workshopAddress, "Workshop", {
                from: carNetworkHostAddress
            }),
            "User already registered in system"
        );
    });

    it("Check Role should work", async () => {
        await registerOwner();
        var result1 = await carNetworkInstance.checkRole(ownerAddress, "Owner");
        assert.strictEqual(result1,
            true,
            "Address does not match role"
            )
    });

    it("Check Role should fail", async () => {
        await registerOwner();
        var result1 = await carNetworkInstance.checkRole(ownerAddress, "Dealer");
        assert.strictEqual(result1,
            false,
            "Address does not match role"
            )
    });

    async function registerOwner(){
        await carNetworkInstance.register(ownerAddress, "Owner", {
            from: carNetworkHostAddress
        });
    };
    async function registerManufacturer(){
        await carNetworkInstance.register(manufacturerAddress, "Manufacturer", {
            from: carNetworkHostAddress
        });
    };
    async function registerDealer(){
        await carNetworkInstance.register(dealerAddress, "Dealer", {
            from: carNetworkHostAddress
        });
    };
    async function registerWorkshop(){
        await carNetworkInstance.register(workshopAddress, "Workshop", {
            from: carNetworkHostAddress
        });
    };

});