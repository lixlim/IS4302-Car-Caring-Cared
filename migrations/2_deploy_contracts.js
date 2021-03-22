const Car = artifacts.require("Car");
const CarNetwork = artifacts.require("CarNetwork");

module.exports = function(deployer, network, accounts){
  deployer.then(()=>{
      return deployer.deploy(CarNetwork, accounts[0]);
  }).then((CarNetworkInstance => {
      return deployer.deploy(Car, CarNetworkInstance.address);
  }))
}