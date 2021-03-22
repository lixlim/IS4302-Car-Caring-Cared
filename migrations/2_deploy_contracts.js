const Car = artifacts.require("Car");
const CarNetwork = artifacts.require("CarNetwork");

module.exports = function(deployer){
  deployer.then(()=>{
      return deployer.deploy(CarNetwork, "0x3d6Ab2E9C5f38607b57862568bE25e8AEB0C5B5A");
  }).then((CarNetworkInstance => {
      console.log(CarNetworkInstance.address);
      return deployer.deploy(Car, CarNetworkInstance.address);
  }))
}