const Car = artifacts.require("Car");
const CarNetwork = artifacts.require("CarNetwork");
const CarMarket = artifacts.require("CarMarket");

module.exports = function (deployer, network, accounts) {

  // #region fakes
  const ownerAddress1 = accounts[1];
  const ownerAddress2 = accounts[2];
  const ownerAddress3 = accounts[3];
  const ownerAddress4 = accounts[4];
  const manufacturerAddress1 = accounts[5];
  const manufacturerAddress2 = accounts[6];
  const dealerAddress1 = accounts[7];
  const workshopAddress1 = accounts[8];
  const workshopAddress2 = accounts[9];

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
    createdBy: manufacturerAddress1,
    createdOn: "2021-03-01 11:26:24",
    comment: "create car, Written by : Merc. Other text and information"
  };
  const newCarServiceRecord2 = {
    createdBy:manufacturerAddress1,
    createdOn: "2020-07-10 04:48:17",
    comment: "create car, Written by : Merc. Other text and information"
  };
  const newCarServiceRecord3 = {
    createdBy: manufacturerAddress1,
    createdOn: "2021-03-01 14:26:24",
    comment: "create car, Written by : Merc. Other text and information"
  };
  const newCarServiceRecord4 = {
    createdBy: manufacturerAddress1,
    createdOn: "2021-01-09 23:17:51",
    comment: "create car, Written by : Merc. Other text and information"
  };
  const newCarServiceRecord5 = {
    createdBy: manufacturerAddress1,
    createdOn: "2021-03-02 11:26:24",
    comment: "create car, Written by : Merc. Other text and information"
  };
  const newCarServiceRecord6 = {
    createdBy: manufacturerAddress1,
    createdOn: "2020-09-08 10:59:00",
    comment: "create car, Written by : Merc. Other text and information"
  };
  const newCarServiceRecord7 = {
    createdBy: manufacturerAddress2,
    createdOn: "2020-09-08 09:59:23",
    comment: "create car, Written by : BMW. Other text and information"
  };
  const newCarServiceRecord8 = {
    createdBy: manufacturerAddress2,
    createdOn: "2020-09-08 03:59:53",
    comment: "create car, Written by : BMW. Other text and information"
  };
  const newCarServiceRecord9 = {
    createdBy: manufacturerAddress2,
    createdOn: "2020-09-08 02:59:33",
    comment: "create car, Written by : BMW. Other text and information"
  };
  const newCarServiceRecord10 = {
    createdBy: manufacturerAddress2,
    createdOn: "2021-01-08 12:27:45",
    comment: "create car, Written by : BMW. Other text and information"
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

  const serviceRecord3 = {
    createdBy: workshopAddress2,
    createdOn: "2021-04-01 12:08:44",
    comment: "This comment is created workshopAddress2. serviceRecord3. Any text goes here"
  };
  // #endregion

  deployer.then(() => {
    return deployer.deploy(CarNetwork, accounts[0]); //admin
  }).then(CarNetworkInstance => {
    console.log("CarNetworkInstance @ " + CarNetworkInstance.address);
    // #region role registration
    CarNetworkInstance.register(ownerAddress1, "Owner");
    CarNetworkInstance.register(ownerAddress2, "Owner");
    CarNetworkInstance.register(ownerAddress3, "Owner");
    CarNetworkInstance.register(ownerAddress4, "Owner");
    CarNetworkInstance.register(manufacturerAddress1, "Manufacturer");
    CarNetworkInstance.register(manufacturerAddress2, "Manufacturer");
    CarNetworkInstance.register(workshopAddress1, "Workshop");
    CarNetworkInstance.register(workshopAddress2, "Workshop");
    CarNetworkInstance.register(dealerAddress1, "Dealer");
    // #endregion

    return deployer.deploy(Car, CarNetworkInstance.address);
  }).then(CarInstance => {
    // #region create car and service records
    CarInstance.createCar(vin1, carModel1, newCarServiceRecord1, {
      from: manufacturerAddress1
    });
    CarInstance.createCar(vin2, carModel2, newCarServiceRecord2, {
      from: manufacturerAddress1
    });
    CarInstance.createCar(vin3, carModel3, newCarServiceRecord3, {
      from: manufacturerAddress1
    });
    CarInstance.createCar(vin4, carModel4, newCarServiceRecord4, {
      from: manufacturerAddress1
    });
    CarInstance.createCar(vin5, carModel5, newCarServiceRecord5, {
      from: manufacturerAddress1
    });
    CarInstance.createCar(vin6, carModel6, newCarServiceRecord6, {
      from: manufacturerAddress2
    });
    CarInstance.createCar(vin7, carModel7, newCarServiceRecord7, {
      from: manufacturerAddress2
    });
    CarInstance.createCar(vin8, carModel8, newCarServiceRecord8, {
      from: manufacturerAddress2
    });
    CarInstance.createCar(vin9, carModel9, newCarServiceRecord9, {
      from: manufacturerAddress2
    });
    CarInstance.createCar(vin10, carModel10, newCarServiceRecord10, {
      from: manufacturerAddress2
    });
    // #endregion

    // #region transfer car to owner
    CarInstance.transferCar(vin1, ownerAddress1, {
      from: manufacturerAddress1
    });
    CarInstance.transferCar(vin2, ownerAddress2, {
      from: manufacturerAddress1
    });
    CarInstance.transferCar(vin3, ownerAddress3, {
      from: manufacturerAddress1
    });
    CarInstance.transferCar(vin4, ownerAddress3, {
      from: manufacturerAddress1
    });
    CarInstance.transferCar(vin6, dealerAddress1, {
      from: manufacturerAddress2
    });
    CarInstance.transferCar(vin7, dealerAddress1, {
      from: manufacturerAddress2
    });
    CarInstance.transferCar(vin8, dealerAddress1, {
      from: manufacturerAddress2
    });
    // #endregion

    // #region workshop service record
    CarInstance.authWorkshop(vin1, workshopAddress1, {
      from: ownerAddress1
    });
    CarInstance.addServiceRecord(vin1, serviceRecord1, {
      from: workshopAddress1
    });
    CarInstance.authWorkshop(vin1, workshopAddress2, {
      from: ownerAddress1
    });
    CarInstance.addServiceRecord(vin1, serviceRecord3, {
      from: workshopAddress2
    });

    CarInstance.authWorkshop(vin2, workshopAddress1, {
      from: ownerAddress2
    });
    CarInstance.addServiceRecord(vin2, serviceRecord2, {
      from: workshopAddress1
    });
  
    CarInstance.authWorkshop(vin3, workshopAddress2, {
      from: ownerAddress3
    });
    CarInstance.addServiceRecord(vin3, serviceRecord3, {
      from: workshopAddress2
    });
    // #endregion
    
    console.log("CarInstance @ " + CarInstance.address);
    return deployer.deploy(CarMarket, CarInstance.address);
  }).then(CarMarketInstance => {
    // #region list car
    CarMarketInstance.list(vin2, 61888, {
      from: ownerAddress2
    });
    CarMarketInstance.list(vin3, 61888, {
      from: ownerAddress3
    });
    CarMarketInstance.list(vin5, 72730, {
      from: manufacturerAddress1
    });

    CarMarketInstance.list(vin6, 51500, {
      from: dealerAddress1
    });
    CarMarketInstance.list(vin7, 61400, {
      from: dealerAddress1
    });
    CarMarketInstance.list(vin8, 155800, {
      from: dealerAddress1
    });

    CarMarketInstance.list(vin9, 155800, {
      from: manufacturerAddress2
    });
    CarMarketInstance.list(vin10, 155800, {
      from: manufacturerAddress2
    });
    // #endregion
    console.log("CarMarketInstance @ " + CarMarketInstance.address);
  });
}
