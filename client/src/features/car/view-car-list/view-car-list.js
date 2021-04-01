import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import getWeb3 from "../../../getWeb3";
import "./view-car-list.css";
import {
  Redirect
} from "react-router-dom";

class ViewCarList extends Component {
    
    state = { cars: null, vin: null, carRecord: null, viewMore: false, list: false};

    //retriving data and setting list of cars for user
    constructor(props) {
        super(props);
        console.log(props)
        this.state = { totalCar: 0, cars: [{ name: "car1", carId: "12345", owner: "tom" }, { name: "car2", carId: "00001", owner: "tom" }] };
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
        
  
        //Check user role
        //Manufactorer will call getManufacturedCarsList
        const carList = await carContract.methods.getOwnedCarsList().call({ from: accounts[0] });
        if(carList) {
          console.log("success");
        }
        console.log(carList);
        this.setState({cars: carList});
        console.log(this.state);
    };
    
    prepareView(carVin) {
      console.log("Set carVin -> " + carVin + "::" + typeof(carVin));
      this.setState({vin: carVin});
      console.log(this.state);
      this.callContract(carVin);
    }

    callContract = async(carVin) => {
      try {
        const { accounts, carContract } = this.state;
        const carRecord = await carContract.methods.getCarByVin(
          carVin,
        ).call({ from: accounts[0] });
        console.log(carRecord)
        if (carRecord) {
          this.setState({
            viewMore: true,
            carRecord: carRecord
          })
        }
      } catch (er) {
        console.log(er)
      }
    }
    
    
    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }

        if (this.state.viewMore) {
          return <Redirect
          to={{
            pathname: "/viewCar/" + this.state.vin,
            state: { carRecord: this.state.carRecord }
          }}
          />
        }

        const { totalCar, cars } = this.state;

        return (
        <div class="main">
            {cars &&
            <div>
              <h1>View Car List</h1>
              <label>
                <div> Total Cars owned: { cars.length } </div>
              </label>
              <table className="table">
                <thead className="table-dark">
                  <tr>
                      <th>Car Vin</th>
                      <th>Model</th>
                      <th></th>
                      <th></th>
                      <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car =>
                  <tr key={car.carVin}>
                      <td>{car.carVin}</td>
                      <td>{car.carModel}</td>
                      <td><button onClick={() => this.prepareView(car.carVin)} className="btn btn-primary">View more</button></td>
                      <td><button onClick={() => console.log(car.carVin)} className="btn btn-success">List</button></td>
                      <td><button onClick={() => console.log("Go to authorize page")} className="btn btn-secondary">Authorize</button></td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>
            }
        </div>
    
    )
  }
}

export default ViewCarList;