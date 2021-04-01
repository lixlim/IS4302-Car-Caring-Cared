import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import getWeb3 from "../../../getWeb3";
import './transfer-ownership.css';
import Navbar from "../../main/navbar";

class TransferOwnership extends Component {

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
    this.handleChangeNewOwner = this.handleChangeNewOwner.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeVIN(event) {
    this.setState({vin: event.target.value});
  }

  handleChangeNewOwner(event) {
    this.setState({newOwner: event.target.value});
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
    } catch (er) {
      this.setState({error: er})
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
      this.setState({ web3, accounts, carContract: carContractInstance, carNetwork: carNetworkInstance });
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
      <Navbar/>
      <div class="main">   
        <h1>Transfer Car Ownership</h1>    
        <p>
          Update car owner record in the blockchain.
        </p> 
        <div class="form-container">
            <form onSubmit={this.handleSubmit}>
            <div class="form-sub-container">
              <div>
                <div class="mb-3">
                  <label class="form-label">Vehicle Identification Number (VIN)</label>
                  <input class="form-control" required onChange={this.handleChangeVIN}/>
                </div>
                <div class="mb-3">
                  <label class="form-label">New Owner Address</label>
                  <input class="form-control" required onChange={this.handleChangeNewOwner}/>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            {this.state.formSubmission && <div class="alert alert-success" role="alert">
                The ownership of the car is transferred successfully!
              </div>
            }
            {this.state.error && <div class="alert alert-danger" role="alert">
              Error in transferring ownership.
            </div>
            }
          </div>    
      </div>
      </>
    );
  }
}

export default TransferOwnership;