import React, { Component } from "react";
import { Route, BrowserRouter, } from "react-router-dom";
import Login from './features/main/login';
import Homepage from './features/main/homepage';
import Testpage from './features/main/testpage';
import ProtectedRoute from "./features/main/protectedroute";
import { AuthProvider } from "./features/main/authprovider";
import ViewCarList from './features/car/view-car-list/view-car-list';
import ViewOneCar from './features/car/view-car-list/view-car';
import AddCar from './features/car/add-car/add-car';
import TransferOwnership from './features/car/transfer-ownership/transfer-ownership';
import AuthoriseWorkshop from './features/car/authorise-workshop/authorise-workshop';
import CreateServiceRecord from './features/service-workshop/create-service-record/create-service-record';
import SearchCar from './features/car/search-car/search-car';
import Marketplace from './features/car/marketplace/marketplace';
import Register from './features/main/register/register';
import ListCar from './features/car/list-car/list-car';
import CarNetworkContract from "./contracts/CarMarket.json";
import CarContract from './contracts/Car.json';
import getWeb3 from "./getWeb3";
import firebase from 'firebase/app';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedCarNetwork = CarNetworkContract.networks[networkId];
      const deployedCarContract = CarContract.networks[networkId];

      const carNetworkInstance = new web3.eth.Contract(
        CarNetworkContract.abi,
        deployedCarNetwork && deployedCarNetwork.address,
      );

      const carContractInstance = new web3.eth.Contract(
        CarContract.abi,
        deployedCarContract && deployedCarContract.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, carContract: carContractInstance, carNetwork: carNetworkInstance }, this.populateData);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  populateData() {
    if (!sessionStorage.getItem('isDataPopulated')) {
      let isFirebaseSuccess = this.populateDataInFirebase();
      if (isFirebaseSuccess) {
        sessionStorage.setItem("isDataPopulated", true)
      }
    }
  }

  populateDataInFirebase = async () => {
    //call contract to get Car with WBAW672030PZ24183
    try {
      const { accounts, carContract } = this.state;
      const carRecord = await carContract.methods.getCarByVin(
        'WBAW672030PZ24183',
      ).call({ from: accounts[0] });
      if (carRecord) {
        this.setState({
          viewMore: true,
          carRecord: { ...carRecord}
        })
      }
    } catch (er) {
      console.log(er)
    };

    const accounts = this.state.carRecord;
    console.log(accounts)

    const dbAccounts = [
      'UQP6vtNA0uaXva1XK967mjw0gJm2', //manufacturer2
      'iex0Vm2LlpdokPsXHc8Gp9h11f33', //ownerAddress1
      '5nQhDY1P3ge3IporzRF5uWs2QLm2', //ownerAddress2
      '9k29mAKjrdeXBuISobngypB1FF93', //ownerAddress3
      'KsQqBlQ3TuZ0Uq6C8vpd10LR0kP2', //ownerAddress4
      'ENqGv5bdRTY5VcrGpaEkRvXfixr1', //manufacturerAddress1
      'UNgy2Q7uTRNUtaCEhoz8WyBMC562', //dealerAddress1
      'plSdhfe7dxSuOTVwSzzf57ybel52', //workshopAddress1
      'T5iOlJZKINcC9TYE3ZvVF92U9832', //workshopAddress2
    ];
    for (let i = 0; i < 9; i++) {
      firebase.database().ref('/accounts/' + dbAccounts[i]).update({
        accountAddress: this.state.carRecord.ownersList[i],
      }, (error) => {
        if (error) {
          alert(dbAccounts[i] + "not initialised");    
          return false;
        } else {
        }
      });
    }
    return true;
  }

  render() {

    return (
      <BrowserRouter>
        <AuthProvider>
          <Route path='/login' component={Login} />
          <ProtectedRoute exact path="/" component={Homepage} />
          <ProtectedRoute exact path="/test" component={Testpage} />
          <ProtectedRoute exact path="/view-car/:id" component={ViewOneCar} />
          <ProtectedRoute exact path="/view-car" component={ViewCarList} />
          <ProtectedRoute path="/transfer-ownership" component={TransferOwnership}/>
          <ProtectedRoute path="/create-car" component={AddCar}/>
          <ProtectedRoute path="/authorise-workshop/:id" component={AuthoriseWorkshop}/>
          <ProtectedRoute path="/create-service-record" component={CreateServiceRecord}/>
          <ProtectedRoute path="/register" component={Register}/>
          <ProtectedRoute path="/search-car" component={SearchCar} />
          <ProtectedRoute path="/marketplace" component={Marketplace} />
          <ProtectedRoute path="/listCar/:id" component={ListCar}/>
      </AuthProvider>
      </BrowserRouter>
    );
  }
};

export default App;
