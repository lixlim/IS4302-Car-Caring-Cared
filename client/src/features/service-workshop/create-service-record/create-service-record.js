import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import getWeb3 from "../../../getWeb3";
import './create-service-record.css'
import moment from 'moment';

class CreateServiceRecord extends Component {

  constructor() {
    super();
    this.state = { 
      web3: null, 
      accounts: null, 
      carContract: null, 
      carNetworkContract: null,
      vin: null,
      comment: null 
    };
    this.handleChangeVIN = this.handleChangeVIN.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeVIN(event) {
    this.setState({vin: event.target.value});
  }

  handleChangeComment(event) {
    this.setState({comment: event.target.value});
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
    const serviceRecord = {
      comment: this.state.comment,
      createdBy: accounts[0],
      createdOn: moment().format()
    }

    console.log(serviceRecord)
    const serviceRecordCreated = await carContract.methods.addServiceRecord(
      this.state.vin,
      serviceRecord
    ).send({ from: accounts[0] });
    console.log(serviceRecordCreated)
    if (serviceRecordCreated) {
      this.setState({
        formSubmission: true
      })
    }
    // Get the value from the contract to prove it worked.
    // const carCreated = await contract.methods.carMap(this.state.vin).call();

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
      <div class="main">   
        <h1>Create service record</h1>    
        <p>
          Create a service record that includes the details of the servicing done to the car.
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
                  <label class="form-label">Servicing details</label>
                  <p>
                    Pleaase input information of maintenance or repair work done on the vehicle.
                  </p>
                  <textarea  cols="10" rows="5" charswidth="23" class="form-control" required  onChange={this.handleChangeComment}/>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            {this.state.formSubmission && <div class="alert alert-success" role="alert">
                The service record is updated successfully!
              </div>
              }
          </div>    
      </div>
    );
  }
}

export default CreateServiceRecord;