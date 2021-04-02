const Car = artifacts.require("Car");
const CarNetwork = artifacts.require("CarNetwork");
const CarMarket = artifacts.require("CarMarket");
module.exports = function(deployer, network, accounts){
  deployer.then(()=>{
    return deployer.deploy(CarNetwork, accounts[0]);
  }).then((CarNetworkInstance => {
    console.log("CarNetworkInstance @ " + CarNetworkInstance.address);
    return deployer.deploy(Car, CarNetworkInstance.address);
  })).then((CarInstance => {
    console.log("CarInstance @ " + CarInstance.address);
    return deployer.deploy(CarMarket, CarInstance.address);
  })).then((CarMarketInstance => {
    console.log("CarMarketInstace @ " + CarMarketInstance.address);
  }))
}
