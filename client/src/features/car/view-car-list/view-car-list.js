import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import getWeb3 from "../../../getWeb3";
import "./view-car-list.css";


class ViewCarList extends Component {
    
    state = {totalCar: 0, cars: null};

    //retriving data and setting list of cars for user
    constructor(props) {
        super(props);
        //this.state = {totalCar: 0, cars: [{name: "car1", carId: "12345", owner: "tom"}, {name: "car2", carId: "00001", owner: "tom"}]};
        this.preload();
        console.log(this.state);
        this.forceUpdate()
    }

    preload = async () => {
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          const deployedCarContract = CarContract.networks[networkId];
          const deployedCarNetwork = CarNetworkContract.networks[networkId];
    
          const carContractInstance = new web3.eth.Contract(
            CarContract.abi,
            deployedCarContract && deployedCarContract.address,
          );
    
          const carNetworkInstance = new web3.eth.Contract(
            CarNetworkContract.abi,
            deployedCarNetwork && deployedCarNetwork.address,
          );
    
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, accounts, carContract: carContractInstance, carNetwork: carNetworkInstance });
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }

        const {accounts, carContract, carNetwork} = this.state;
        try {
          /*
          const carCreated1 = await carContract.methods.createCar(
            "VIN12340",
            "CarModel12345",
            {
              comment: "comment 2",
              createdBy: accounts[0],
              createdOn: "2020-02-21"
            }
          ).send({ from: accounts[0] });
          console.log(carCreated1);
          */
        } catch(e) {
          console.log(e);
        }
        const carList = await carContract.methods.getOwnedCarsList().call();
        if(carList) {
          console.log("success");
        }
        console.log(carList);
        this.setState({cars: carList});
        console.log(this.state);
    };
    
    
    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }

        const { totalCar, cars } = this.state;

        return (
        <div>
            {cars &&
            <div>
              <label>
                <div> Total Cars owned: { cars.length } </div>
              </label>
              <table className="table">
                <thead className="table-dark">
                  <tr>
                      <th>Car Vin</th>
                      <th>Model</th>
                      <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car =>
                  <tr key={car.carVin}>
                      <td>{car.carVin}</td>
                      <td>{car.carModel}</td>
                      <td><button onClick={() => console.log(car.carVin)} className="btn btn-primary">view more</button></td>
                  </tr> 
                  )}
                </tbody>
              </table>
            </div>
            }
            <p>
            {this.state.totalCar}
            </p>
        </div>
    );  
  }
}

export default ViewCarList;