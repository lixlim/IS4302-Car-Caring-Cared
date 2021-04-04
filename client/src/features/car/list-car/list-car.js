  
import React, { Component } from "react";
import CarContract from "../../../contracts/Car.json";
import CarNetworkContract from "../../../contracts/CarNetwork.json";
import CarMarketContract from "../../../contracts/CarMarket.json";
import getWeb3 from "../../../getWeb3";
import Navbar from "../../main/navbar";

class ListCar extends Component {

    constructor() {
        super();
        this.state = { 
            web3: null, 
            accounts: null, 
            carContract: null, 
            carNetworkContract: null,
            vin: null,
            newOwner: null,
            marketValue : 0,
            listValue: 0
        };
        this.preload();
        this.handleChangeListingValue = this.handleChangeListingValue.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.unlistCar = this.unlistCar.bind(this)
    }

    preload = async () => {

        var url = window.location.pathname.split('/');

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
            this.setState({ vin: url[2], web3, accounts, carMarketContract: carMarketInstance, carContract: carContractInstance, carNetwork: carNetworkInstance });
        } catch (error) {
            // Catch any errors for any of the above operations.
        alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    }

    const {carMarketContract} = this.state;
    
    try {
        const carValue = await carMarketContract.methods.checkPrice(this.state.vin).call();
        console.log("Car Value in market contract is " + carValue);
        this.setState({marketValue: carValue});
        console.log(this.state);
    } catch(e) {
        console.log(e);
    }
};

  handleChangeListingValue(event) {
    this.setState({listValue: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Sending listing request for " + this.state.vin + " at " + this.state.listValue);
    this.callContract_List();
  }

  callContract_List = async() => {
    this.setState({
      formSubmission: false
    })
    const { accounts, carMarketContract } = this.state;
    const listing = await carMarketContract.methods.list(
      this.state.vin,
      this.state.listValue,
    ).send({ from: accounts[0] });
    console.log(listing)
    if(listing) {
        this.setState({
            formSubmission: true
        })
    }
  }

  unlistCar(event) {
    event.preventDefault();
    this.callContract_Unlist();
  }

  callContract_Unlist = async() => {
    this.setState({
        formSubmission: false
    })
    const { accounts, carMarketContract } = this.state;
    const listing = await carMarketContract.methods.unlist(
        this.state.vin,
    ).send({ from: accounts[0] });
    console.log(listing)
    if(listing) {
        this.setState({
            formSubmission: true
        })
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const { marketValue } = this.state;
    return (
        <>
        <Navbar/>
        <div class="main">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/view-car">Car List</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{this.state.vin}</li>
                </ol>
            </nav>
            {marketValue == 0 &&
            <div>
                <h1>Listing for Car : {this.state.vin}</h1>
                <div class="form-container">
                    <form onSubmit={this.handleSubmit}>
                        <div class="form-sub-container">
                        <div>
                            <div class="mb-3">
                                <label class="form-label">Value for listing</label>
                                <input class="form-control" type="number" required onChange={this.handleChangeListingValue}/>
                            </div>
                        </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                        {this.state.formSubmission &&
                            <div class="alert alert-success" role="alert">
                                The car has been listed successfully!
                            </div>
                        }
                </div>
            </div>
            }

            {marketValue > 0 &&
            <div>
            <h1>Listing for Car : {this.state.vin}</h1>
            <h2>List at: ${this.state.marketValue}</h2>
            <div class="form-container">
                <form onSubmit={this.unlistCar}>
                    <button type="submit" class="btn btn-primary">Unlist</button>
                </form>
                    {this.state.formSubmission &&
                        <div class="alert alert-success" role="alert">
                            The car has been unlisted!
                        </div>
                    }
            </div>
        </div>
        }
        </div>
        </>
    );
  }
}

export default ListCar;