const Car = artifacts.require("Car");
const CarNetwork = artifacts.require("CarNetwork");
const CarMarket = artifacts.require("CarMarket");

module.exports = function (deployer, network, accounts) {

  const vin1 = "WBAAL32040AZ12247";
  const vin2 = "WBAWL72030PZ83186";
  const vin3 = "WBAAL51040AZ14245";
  const vin4 = "WBAWL92030PZ85184";
  const vin5 = "WBAAL12040AZ16243";
  const vin6 = "WBAWL22030PZ85182";
  const vin7 = "WBAAL32040AZ16241";
  const vin8 = "WBAWL42030PZ87180";
  const vin9 = "WBAAL52040AZ18245";
  const vin10 = "WBAW672030PZ24183";
  const carModel1 = "Mercedes-Benz GLA180";
  const carModel2 = "Mercedes-Benz GLA200";
  const carModel3 = "Mercedes-Benz GLA250";
  const carModel4 = "Mercedes-Benz GLA35";
  const carModel5 = "Mercedes-Benz GLA45";
  const carModel6 = "BMW 218i";
  const carModel7 = "BMW 220i";
  const carModel8 = "BMW 320d";
  const carModel9 = "BMW 320i";
  const carModel10 = "BMW 428i";

  const newCarServiceRecord1 = {
    createdBy: accounts[6],
    createdOn: "2021-03-01 11:26:24",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const newCarServiceRecord2 = {
    createdBy: accounts[6],
    createdOn: "2020-07-10 04:48:17",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const newCarServiceRecord3 = {
    createdBy: accounts[6],
    createdOn: "2021-03-01 14:26:24",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const newCarServiceRecord4 = {
    createdBy: accounts[6],
    createdOn: "2021-01-09 23:17:51",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const newCarServiceRecord5 = {
    createdBy: accounts[6],
    createdOn: "2021-03-02 11:26:24",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const newCarServiceRecord6 = {
    createdBy: accounts[2],
    createdOn: "2020-09-08 10:59:00",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const newCarServiceRecord7 = {
    createdBy: accounts[2],
    createdOn: "2020-09-08 09:59:23",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const newCarServiceRecord8 = {
    createdBy: accounts[2],
    createdOn: "2020-09-08 03:59:53",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const newCarServiceRecord9 = {
    createdBy: accounts[2],
    createdOn: "2020-09-08 02:59:33",
    comment: "create car, and whatever else comment is to be added by the manufacturer"
  };
  const newCarServiceRecord10 = {
    createdBy: accounts[2],
    createdOn: "2021-01-08 12:27:45",
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

  const serviceRecord3 = {
    createdBy: accounts[3],
    createdOn: "2021-04-01 12:08:44",
    comment: "This comment is created workshopAddress1. serviceRecord3. Any text goes here"
  };


  deployer.then(() => {
    return deployer.deploy(CarNetwork, accounts[0]); //admin
  }).then(CarNetworkInstance => {
    console.log("CarNetworkInstance @ " + CarNetworkInstance.address);
    //role registration
    CarNetworkInstance.register(accounts[1], "Owner");
    CarNetworkInstance.register(accounts[2], "Manufacturer");
    CarNetworkInstance.register(accounts[6], "Manufacturer"); //additional manufacturer for Mercendes-Benz
    CarNetworkInstance.register(accounts[3], "Workshop");
    CarNetworkInstance.register(accounts[4], "Dealer");
    CarNetworkInstance.register(accounts[5], "Owner");
    return deployer.deploy(Car, CarNetworkInstance.address);
  }).then(CarInstance => {
    //create car and service records
    CarInstance.createCar(vin1, carModel1, newCarServiceRecord1, {
      from: accounts[6]
    });
    CarInstance.createCar(vin2, carModel2, newCarServiceRecord2, {
      from: accounts[6]
    });
    CarInstance.createCar(vin3, carModel3, newCarServiceRecord3, {
      from: accounts[6]
    });
    CarInstance.createCar(vin4, carModel4, newCarServiceRecord4, {
      from: accounts[6]
    });
    CarInstance.createCar(vin5, carModel5, newCarServiceRecord5, {
      from: accounts[6]
    });
    CarInstance.createCar(vin6, carModel6, newCarServiceRecord6, {
      from: accounts[2]
    });
    CarInstance.createCar(vin7, carModel7, newCarServiceRecord7, {
      from: accounts[2]
    });
    CarInstance.createCar(vin8, carModel8, newCarServiceRecord8, {
      from: accounts[2]
    });
    CarInstance.createCar(vin9, carModel9, newCarServiceRecord9, {
      from: accounts[2]
    });
    CarInstance.createCar(vin10, carModel10, newCarServiceRecord10, {
      from: accounts[2]
    });


    CarInstance.authWorkshop(vin6, accounts[3], {
      from: accounts[2]
    });
    CarInstance.addServiceRecord(vin6, serviceRecord1, {
      from: accounts[3]
    });

    CarInstance.authWorkshop(vin7, accounts[3], {
      from: accounts[2]
    });
    CarInstance.addServiceRecord(vin7, serviceRecord2, {
      from: accounts[3]
    });
    CarInstance.authWorkshop(vin8, accounts[3], {
      from: accounts[2]
    });
    CarInstance.addServiceRecord(vin8, serviceRecord3, {
      from: accounts[3]
    });
  
    //transfer 1 car to owner
    CarInstance.transferCar(vin1, accounts[1], {
      from: accounts[6]
    });
  
    console.log("CarInstance @ " + CarInstance.address);
    return deployer.deploy(CarMarket, CarInstance.address);
  }).then(CarMarketInstance => {
    CarMarketInstance.list(vin2, 61888, {
      from: accounts[6]
    });
    CarMarketInstance.list(vin3, 72730, {
      from: accounts[6]
    });
    CarMarketInstance.list(vin4, 71588, {
      from: accounts[6]
    });
    CarMarketInstance.list(vin5, 51880, {
      from: accounts[6]
    });
    CarMarketInstance.list(vin6, 51500, {
      from: accounts[2]
    });
    CarMarketInstance.list(vin7, 61400, {
      from: accounts[2]
    });
    CarMarketInstance.list(vin8, 155800, {
      from: accounts[2]
    });
    console.log("CarMarketInstance @ " + CarMarketInstance.address);
  });
}
