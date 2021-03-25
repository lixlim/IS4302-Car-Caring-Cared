import React, { useEffect } from "react";
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


const App = () => {

  const [accounts, setAccounts] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [carNetworkContract, setCarNetWorkContract] = React.useState(null);

  useEffect(() => {

      try {
        // Get network provider and web3 instance.
        const web3 = async () => {await getWeb3()};
  
        // Use web3 to get the user's accounts.
        const accounts = async () => {await web3.eth.getAccounts()};
  
        // Get the contract instance.
        const networkId = async () => {await web3.eth.net.getId()};
        const deployedCarNetwork = CarNetworkContract.networks[networkId];

        const carNetworkInstance = new web3.eth.Contract(
          CarNetworkContract.abi,
          deployedCarNetwork && deployedCarNetwork.address,
        );
  
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setAccounts(accounts);
        console.log(accounts)
        setCarNetWorkContract(carNetworkInstance);
        setWeb3(web3);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          "Failed to load web3, accounts, or contract. Check console for details."
        );
        console.error(error);
      }

      //create dealer in carNetwork
      //create manufacturer carNetwork
      //create workshop in carNetwork

      //update buyer1 account in Firebase db
      firebase.database().ref('/accounts/tKzSuApBmffBzvoOVJb7oAwyEiy2').set({
        accountAddress: accounts[1],
      }, (error) => {
        if (error) {
          alert("Buyer1 not initialised")
        } else {
          // Data saved successfully!
        }
      });

      //update buyer2 account in Firebase db
      //update dealer account in Firebase db
      //update manufacturer account in Firebase db
      //update workshop account in Firebase db


  }, [])

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
};

export default App;
