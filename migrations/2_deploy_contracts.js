const Car = artifacts.require("Car");
const CarNetwork = artifacts.require("CarNetwork");
const CarMarket = artifacts.require("CarMarket");

module.exports = function (deployer, network, accounts) {

  const vin1 = "WBAAL32040AZ13247";
  const vin2 = "WBAWL72030PZ84188";
  const carModel1 = "Mercedes-Benz GLA180";
  const carModel2 = "BMW 318i";
  const newCarServiceRecord1 = {
    createdBy: accounts[2],
    createdOn: "2021-03-01 11:26:24",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const serviceRecord1 = {
    createdBy: accounts[3],
    createdOn: "2021-03-20 15:39:57",
    comment: "This comment is created workshopAddress1. serviceRecord1. Any text goes here"
  };
  const serviceRecord2 = {
    createdBy: accounts[3],
    createdOn: "2021-04-01 12:08:44",
    comment: "This comment is created workshopAddress1. serviceRecord2. Any text goes here"
  };


  deployer.then(() => {
    return deployer.deploy(CarNetwork, accounts[0]); //admin
  }).then(CarNetworkInstance => {
    console.log("CarNetworkInstance @ " + CarNetworkInstance.address);
    //role registration
    CarNetworkInstance.register(accounts[1], "Owner");
    CarNetworkInstance.register(accounts[2], "Manufacturer");
    CarNetworkInstance.register(accounts[3], "Workshop");
    CarNetworkInstance.register(accounts[4], "Dealer");
    CarNetworkInstance.register(accounts[5], "Owner");
    return deployer.deploy(Car, CarNetworkInstance.address);
  }).then(CarInstance => {
    //create car and service records
    CarInstance.createCar(vin1, carModel1, newCarServiceRecord1, {
      from: accounts[2]
    });
    CarInstance.createCar(vin2, carModel2, newCarServiceRecord1, {
      from: accounts[2]
    });
    CarInstance.authWorkshop(vin1, accounts[3], {
      from: accounts[2]
    });
    CarInstance.addServiceRecord(vin1, serviceRecord1, {
      from: accounts[3]
    });
    /*
    CarInstance.authWorkshop(vin2, accounts[3], {
      from: accounts[2]
    });
    CarInstance.addServiceRecord(vin2, serviceRecord1, {
      from: accounts[3]
    });
    CarInstance.authWorkshop(vin2, accounts[3], {
      from: accounts[2]
    });
    CarInstance.addServiceRecord(vin2, serviceRecord2, {
      from: accounts[3]
    });
    */
    console.log("CarInstance @ " + CarInstance.address);
    return deployer.deploy(CarMarket, CarInstance.address);
  }).then(CarMarketInstance => {
    console.log("CarMarketInstance @ " + CarMarketInstance.address);
  });
}
