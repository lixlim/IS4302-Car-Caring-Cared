import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import getWeb3 from "../../../getWeb3";
import './search-car.css';
import ViewCar from "../view-car/view-car";
import Navbar from "../../main/navbar";

class SearchCar extends Component {

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
      const carRecord = await carContract.methods.getCarByVin(
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
      let data = JSON.parse(er.message.slice(er.message.indexOf("{"))).data
      let error = data[Object.keys(data)[0]].reason;
      this.setState({
        formSubmission: false,
        error: error
      })
    }
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      web3.eth.handleRevert = true;
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
        <h1>Search Car</h1>    
        <p>
          Search for a car record in the blockchain.
        </p> 
        <div class="form-container">
          <form onSubmit={this.handleSubmit}>
            <div class="form-sub-container">
              <div>
                <div class="mb-3">
                  <label class="form-label">Vehicle Identification Number (VIN)</label>
                  <div class="form-button-container">
                    <input class="form-control" required onChange={this.handleChangeVIN}/>
                    <button type="submit" class="btn btn-primary">Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {this.state.error && 
          <div class="alert alert-danger" role="alert">
            {this.state.error}
          </div>              
        }
        </div>    
        {this.state.formSubmission && !this.state.error &&
        <ViewCar carRecord={this.state.carRecord}/>
          }
      </div>
      </>
    );
  }
}

export default SearchCar;