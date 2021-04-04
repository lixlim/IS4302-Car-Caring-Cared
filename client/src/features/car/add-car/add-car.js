import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import getWeb3 from "../../../getWeb3";
import "./add-car.css"
import moment from 'moment';
import Navbar from "../../main/navbar";

class AddCar extends Component {
  constructor() {
    super();
    this.state = { 
      web3: null, 
      accounts: null, 
      carContract: null, 
      carNetworkContract: null, 
      vin: null,
      carModel: null,
      comment: null
    };

    this.handleChangeVIN = this.handleChangeVIN.bind(this);
    this.handleChangeCarModel = this.handleChangeCarModel.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeVIN(event) {
    this.setState({vin: event.target.value});
  }

  handleChangeCarModel(event) {
    this.setState({carModel: event.target.value});
  }

  handleChangeComment(event) {
    this.setState({comment: event.target.value});
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
      console.log(accounts[0])
      const serviceRecord = {
        comment: this.state.comment,
        createdBy: accounts[0],
        createdOn: moment().format("YYYY-MM-DD HH:mm:ss")
      }
      const carCreated = await carContract.methods.createCar(
        this.state.vin,
        this.state.carModel,
        serviceRecord
      ).send({ from: accounts[0] });
      console.log(carCreated)
      if (carCreated) {
        this.setState({
          formSubmission: true,
          error: null
        })
      }
    } catch (er) {
      let data = JSON.parse(er.message.slice(0,-1).slice(er.message.indexOf("{"))).value.data.data
      let error = data[Object.keys(data)[0]].reason;
      console.log(data)
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
      <Navbar />
      <div class="main">
        <div>
        <h1>Add a car record</h1>
        <p>
          Create a record of a car that will be stored in the blockchain.
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
                  <label class="form-label">Car model</label>
                  <input class="form-control" required onChange={this.handleChangeCarModel}/>
                </div>
                <div class="mb-3">
                  <label class="form-label">Comment</label>
                  <input class="form-control" required onChange={this.handleChangeComment}/>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            {this.state.formSubmission && <div class="alert alert-success" role="alert">
                A car record is successfully created!
            </div>
            }
            {this.state.error && <div class="alert alert-danger" role="alert">
              {this.state.error}
            </div>
            }
          </div>
        </div>
      </div>
    </>
    );
  }
}

export default AddCar;