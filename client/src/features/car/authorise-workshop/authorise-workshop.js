import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import getWeb3 from "../../../getWeb3";
import './authorise-workshop.css'
import Navbar from "../../main/navbar";

class AuthoriseWorkshop extends Component {

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
    this.handleChangeNewOwner = this.handleChangeNewOwner.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeNewOwner(event) {
    this.setState({newOwner: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.callContract();
  }

  callContract = async() => {
    this.setState({
      formSubmission: false
    })
    const { accounts, carContract } = this.state;
    console.log(carContract)
    const transferOwnership = await carContract.methods.transferCar(
      this.state.vin,
      this.state.newOwner,
    ).send({ from: accounts[0] });
    console.log(transferOwnership)
    if (transferOwnership) {
      this.setState({
        formSubmission: true
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
      let url = window.location.pathname.split('/');
      this.setState({ vin:url[2], web3, accounts, carContract: carContractInstance, carNetwork: carNetworkInstance });
      console.log(this.state.web3, "")
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
      <>
      <Navbar />
      <div class="main">   
       <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/view-car">Car List</a></li>
            <li class="breadcrumb-item active" aria-current="page">{this.state.vin}</li>
        </ol>
        </nav>
        <h1>Authorise Service Workshop</h1>    
        <p>
          Authorise Service Workshops to add service records for your car.
        </p> 
        <div class="form-container">
            <form onSubmit={this.handleSubmit}>
            <div class="form-sub-container">
              <div>
                <div class="mb-3">
                  <label class="form-label">Vehicle Identification Number (VIN): {this.state.vin}</label>
                </div>
                <div class="mb-3">
                  <label class="form-label">Service Workshop Address</label>
                  <input class="form-control" required onChange={this.handleChangeNewOwner}/>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            {this.state.formSubmission && <div class="alert alert-success" role="alert">
                The authorisation is done successfully!
              </div>
              }
          </div>    
      </div>
    </>
    );
  }
}

export default AuthoriseWorkshop;