  
import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import CarMarketContract from "../../../contracts/CarMarket.json";

import getWeb3 from "../../../getWeb3";
import './marketplace.css';

class Marketplace extends Component {

  constructor() {
    super();
    this.state = { 
      web3: null, 
      accounts: null, 
      carContract: null, 
      carNetworkContract: null,
      vin: null,
      newOwner: null 
    };
    this.handleChangeVIN = this.handleChangeVIN.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeVIN(event) {
    this.setState({vin: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.callContract();
  }

  callContract = async() => {
    try {
      this.setState({
        formSubmission: false
      })
      const { accounts, carContract } = this.state;
      const carRecord = await carContract.methods.getCar(
        this.state.vin,
      ).call({ from: accounts[0] });
      console.log(carRecord)
      if (carRecord) {
        this.setState({
          formSubmission: true,
          carRecord: carRecord,
          error: null
        })
      }
    } catch (er) {
      console.log(er)
      this.setState({
        formSubmission: true,
        error: er
      })
    }
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedCarContract = CarContract.networks[networkId];
      const deployedCarNetwork = CarNetworkContract.networks[networkId];
      const deployedCarMarket = CarMarketContract.networks[networkId];

      const carContractInstance = new web3.eth.Contract(
        CarContract.abi,
        deployedCarContract && deployedCarContract.address,
      );

      const carNetworkInstance = new web3.eth.Contract(
        CarNetworkContract.abi,
        deployedCarNetwork && deployedCarNetwork.address,
      );

      const carMarketInstance = new web3.eth.Contract(
        CarMarketContract.abi,
        deployedCarMarket && deployedCarMarket.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, carContract: carContractInstance, carNetwork: carNetworkInstance,
        carMarket: carMarketInstance });

      //manually populate data
      const user = await this.state.carNetwork.methods.register(
        accounts[0],
        "Manufacturer"
      ).send({ from: accounts[0] });
      const carCreated1 = await this.state.carContract.methods.createCar(
        "VIN12345",
        "CarModel12345",
        {
          comment: "comment 2",
          createdBy: accounts[0],
          createdOn: "2020-02-21"
        }
      ).send({ from: accounts[0] });
      const carCreated2 = await this.state.carContract.methods.createCar(
        "VIN123456",
        "CarModel123456",
        {
          comment: "comment 23",
          createdBy: accounts[0],
          createdOn: "2020-02-22"
        }
      ).send({ from: accounts[0] });
      const listCar = await this.state.carMarket.methods.list(
        "VIN123456",
        1234567
      ).send({ from: accounts[0] });
      const listCar1 = await this.state.carMarket.methods.list(
        "VIN12345",
        12345678
      ).send({ from: accounts[0] });
      console.log(listCar)
      console.log(listCar1)
      const allListedCars = await this.state.carMarket.methods.getAllListedCars(
      ).call({ from: accounts[0] });
      this.setState({
        listedCars: allListedCars
      })
      console.log(allListedCars)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div class="main">   
        <h1>Car Marketplace</h1>    
        <p>
          View listed cars in the system.
        </p> 
        {this.state.listedCars &&
            <table class="table table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>No.</th>
                  <th>Car Model</th>
                  <th>Car Vin</th>
                  <th>Car Price</th>
                  <th>Car Owner</th>
                  <th>Actions</th>
                </tr>
              </thead>
            {this.state.listedCars && this.state.listedCars.map((listedCar, index) => {
            return  (
              <tr>
                <td>{index + 1}</td>
                <td>{listedCar.carModel}</td>
                <td>{listedCar.carVin}</td>
                <td>${listedCar.carPrice}</td>
                <td>{listedCar.carOwner}</td>
                <td>
                <button onClick={() => console.log(listedCar.carVin)} class="btn btn-primary">view more</button>
                </td>
              </tr>
            )})}
          </table>
          }
   
      </div>
    );
  }
}

export default Marketplace;