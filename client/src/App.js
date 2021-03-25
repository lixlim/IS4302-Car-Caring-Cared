import React, { Component } from "react";
import { Route, BrowserRouter, } from "react-router-dom";
import Login from './features/main/login';
import Homepage from './features/main/homepage';
import Testpage from './features/main/testpage';
import ProtectedRoute from "./features/main/protectedroute";
import { AuthProvider } from "./features/main/authprovider";
import ViewCarList from './features/car/view-car-list/view-car-list';
import ViewOneCar from './features/car/view-car-list/view-car';
import getWeb3 from "./getWeb3";
import CarNetworkContract from "./contracts/CarNetwork.json";
import firebase from "firebase/app";


class App extends Component {

  //create dealer in carNetwork
  //create manufacturer carNetwork
  //create workshop in carNetwork
  //update buyer1 account in Firebase db
  //update buyer2 account in Firebase db
  //update dealer account in Firebase db
  //update manufacturer account in Firebase db
  //update workshop account in Firebase db
  state = {
    web3: null,
    accounts: null,
    carNetworkContract: null,
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

      const carNetworkInstance = new web3.eth.Contract(
        CarNetworkContract.abi,
        deployedCarNetwork && deployedCarNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, carNetwork: carNetworkInstance }, this.populateData);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  populateData() {
    
    //uid in database - buyer1, buyer2, dealer, manufacturer, workshop
    const dbAccounts = ['tKzSuApBmffBzvoOVJb7oAwyEiy2', '5KeM3N5akxTJPku1QAESVfRZkPH3', 'UNgy2Q7uTRNUtaCEhoz8WyBMC562', 'ENqGv5bdRTY5VcrGpaEkRvXfixr1', 'plSdhfe7dxSuOTVwSzzf57ybel52'];
    for (var i = 1; i < 6; i++) {
      firebase.database().ref('/accounts/' + dbAccounts[i]).update({
        accountAddress: this.state.accounts[i],
      }, (error) => {
        if (error) {
          alert(dbAccounts[i] + "not initialised");
        } else {
          // Data saved successfully!
        }
      });
    }

  }
  // firebase.database().ref('accounts/5KeM3N5akxTJPku1QAESVfRZkPH3').update({
  //   accountAddress: isAccounts,
  // }, (error) => {
  //   if (error) {
  //     alert("Buyer2 not initialised")
  //   } else {
  //     // Data saved successfully!
  //   }
  // });
  render() {

    return (
      <BrowserRouter>
        <AuthProvider>
          <Route path='/login' component={Login} />
          <ProtectedRoute exact path="/" component={Homepage} />
          <ProtectedRoute exact path="/test" component={Testpage} />
          <ProtectedRoute exact path="/viewCar/:id" component={ViewOneCar} />
          <ProtectedRoute exact path="/viewCar" component={ViewCarList} />
        </AuthProvider>
      </BrowserRouter>

    );
  }
};

export default App;
