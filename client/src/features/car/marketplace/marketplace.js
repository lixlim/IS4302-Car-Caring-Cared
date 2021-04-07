  
import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import CarMarketContract from "../../../contracts/CarMarket.json";
import getWeb3 from "../../../getWeb3";
import './marketplace.css';
import {
  Redirect
} from "react-router-dom";
import Navbar from "../../main/navbar";
import AccountService from "../../../services/accounts.service";

class Marketplace extends Component {

  constructor() {
    super();
    this.state = { 
      web3: null, 
      accounts: null, 
      carContract: null, 
      carNetworkContract: null,
      carMarket: null,
      listedCars: []
    };
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
        formSubmission: false,
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
      
      this.loadListedCars();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  thousands_separators(num) {
    let num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }


  loadListedCars = async() => {
    try {
      const { accounts, carMarket, listedCars } = this.state;
      const allListedCars = await carMarket.methods.getAllListedCars(
        ).call({ from: accounts[0] });
      console.log(allListedCars)
      allListedCars.forEach((car, index) => {
        console.log(car.carOwner)
        AccountService.getAccountWithAddress(car.carOwner)
        .on("value", snapshot => {
          snapshot.forEach((data) => {
            let userAccount = data.val();
            console.log(userAccount)
            if (userAccount) {
              const processedCar = {
                carModel: car.carModel,
                carOwner: car.carOwner,
                carPrice: this.thousands_separators(car.carPrice),
                carVin: car.carVin,
                email: userAccount.email
              };
              console.log(processedCar)
              const tempListedCars = listedCars;
              tempListedCars[index] = processedCar;
              this.setState({
                listedCars: tempListedCars
              })
              console.log(allListedCars.length)
              console.log(this.state.listedCars.length)

              if (index + 1 === allListedCars.length) {
                this.setState({ dataProcessed: true})
              }
            }
          })
        })
      })
    } catch (er) {
      console.log(er)
    }
  }

  prepareView(listedCar) {
    console.log("Set carVin -> " + listedCar.carVin + "::" + typeof(listedCar.carVin));
    this.setState({vin: listedCar.carVin});
    console.log(this.state);
    this.callContract(listedCar);
  }

  callContract = async(listedCar) => {
    try {
      const { accounts, carContract, carMarket } = this.state;
      const carRecord = await carContract.methods.getCarByVin(
        listedCar.carVin,
      ).call({ from: accounts[0] });
      const carPrice = await carMarket.methods.checkPrice(
        listedCar.carVin,
      ).call({ from: accounts[0] });
      console.log(carPrice)
      if (carRecord && carPrice) {
        this.setState({
          viewMore: true,
          carRecord: { ...carRecord, carPrice, email: listedCar.email}
        })
      }
    } catch (er) {
      console.log(er)
    }
  }

  render() {
    if (this.state.viewMore) {
      return <Redirect
      to={{
        pathname: "/view-car/" + this.state.vin,
        state: { carRecord: this.state.carRecord }
      }}
      />
    }
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <>
      <Navbar/>
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
                  <th>Car Vin</th>
                  <th>Car Model</th>
                  <th>Car Price</th>
                  <th>Car Owner</th>
                  <th>Actions</th>
                </tr>
              </thead>
            {this.state.dataProcessed && this.state.listedCars.map((listedCar, index) => {
            return  (
              <tr key={listedCar.carVin}>
                <td>{index + 1}</td>
                <td>{listedCar.carVin}</td>
                <td>{listedCar.carModel}</td>
                <td>${listedCar.carPrice}</td>
                <td>{listedCar.email}</td>
                <td>
                <button onClick={() => this.prepareView(listedCar)} class="btn btn-primary">View more</button>
                </td>
              </tr>
            )})}
          </table>
          }
   
      </div>
      </>
    );
  }
}

export default Marketplace;