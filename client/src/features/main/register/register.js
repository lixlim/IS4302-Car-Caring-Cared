import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import getWeb3 from "../../../getWeb3";
import './register.css'
class Register extends Component {

  constructor() {
    super();
    this.state = { 
      web3: null, 
      accounts: null, 
      carNetworkContract: null,
      role: null,
      accountToRegister: null
    };
    this.handleChangeAccount = this.handleChangeAccount.bind(this)
    this.handleChangeRole = this.handleChangeRole.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeAccount(event) {
    this.setState({accountToRegister: event.target.value});
  }

  handleChangeRole(event) {
    this.setState({role: event.target.value});
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
      const { accounts, carNetwork } = this.state;
      console.log(carNetwork)
      const registerUser = await carNetwork.methods.register(
        this.state.accountToRegister,
        this.state.role
      ).send({ from: accounts[0] });
      console.log(registerUser)
      if (registerUser) {
        this.setState({
          formSubmission: true
        })
      }
      console.log(registerUser)
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
      <div class="main">   
        <h1>Register User</h1>    
        <div class="form-container">
            <form onSubmit={this.handleSubmit}>
            <div class="form-sub-container">
              <div>
                <div class="mb-3">
                  <label class="form-label">User Address</label>
                  <input class="form-control" required onChange={this.handleChangeAccount}/>
                </div>
                <div class="mb-3">
                  <label class="form-label">Role</label>
                  <input class="form-control" required onChange={this.handleChangeRole}/>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            {this.state.formSubmission && <div class="alert alert-success" role="alert">
                The user is registered successfully!
              </div>
            }
            {this.state.error && <div class="alert alert-danger" role="alert">
              Error in registering user.
            </div>
            }
          </div>    
      </div>
    );
  }
}

export default Register;