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
  };

  // componentDidMount = async () => {
  //   try {
  //     // Get network provider and web3 instance.
  //     const web3 = await getWeb3();

  //     // Use web3 to get the user's accounts.
  //     const accounts = await web3.eth.getAccounts();

  //     // Get the contract instance.
  //     const networkId = await web3.eth.net.getId();
  //     const deployedCarNetwork = CarNetworkContract.networks[networkId];

  //     const carNetworkInstance = new web3.eth.Contract(
  //       CarNetworkContract.abi,
  //       deployedCarNetwork && deployedCarNetwork.address,
  //     );

  //     // Set web3, accounts, and contract to the state, and then proceed with an
  //     // example of interacting with the contract's methods.
  //     this.setState({ web3, accounts, carNetwork: carNetworkInstance }, this.populateData);
  //     console.log("callFirebase");
  //   } catch (error) {
  //     // Catch any errors for any of the above operations.
  //     alert(
  //       `Failed to load web3, accounts, or contract. Check console for details.`,
  //     );
  //     console.error(error);
  //   }
  // };

  // populateData() {
  //   if (!sessionStorage.getItem('isDataPopulated')) {
  //     console.log('test')
  //     // let isFirebaseSuccess = this.populateDataInFirebase();
  //     let isBlockchainSuccess = this.populateDataInBlockchain();
  //     // if (isFirebaseSuccess && isBlockchainSuccess) {
  //     //   sessionStorage.setItem("isDataPopulated", true)
  //     // }
  //     if (isBlockchainSuccess) {
  //       sessionStorage.setItem("isDataPopulated", true)
  //     }
  //   }
  // }

  // populateDataInFirebase() {
  //   console.log("firebase populate")
  //   //uid in database - admin, buyer1, buyer2, dealer, manufacturer, workshop
  //   const dbAccounts = ['cgsxJNLAXeVtEN2H8UxxmK271mE2', 'tKzSuApBmffBzvoOVJb7oAwyEiy2', '5KeM3N5akxTJPku1QAESVfRZkPH3', 'UNgy2Q7uTRNUtaCEhoz8WyBMC562', 'ENqGv5bdRTY5VcrGpaEkRvXfixr1', 'plSdhfe7dxSuOTVwSzzf57ybel52'];
  //   for (let i = 0; i < 6; i++) {
  //     firebase.database().ref('/accounts/' + dbAccounts[i]).update({
  //       accountAddress: this.state.accounts[i],
  //     }, (error) => {
  //       if (error) {
  //         alert(dbAccounts[i] + "not initialised");    
  //         return false;
  //       } else {
  //       }
  //     });
  //   }
  //   return true;
  // }

  // populateDataInBlockchain = async () => {
  //   console.log("blockchain populate")
  //   const { accounts, carNetwork } = this.state;
  //   //accounts
  //   const dealerCreated = await carNetwork.methods.register(
  //     accounts[3],
  //     "Dealer",
  //   ).send({ from: accounts[0] });

  //   const manufacturerCreated = await carNetwork.methods.register(
  //     accounts[4],
  //     "Manufacturer",
  //   ).send({ from: accounts[0] });

  //   const workshopCreated = await carNetwork.methods.register(
  //     accounts[5],
  //     "Workshop",
  //   ).send({ from: accounts[0] });

  //   //check if create is successful
  //   const dealer = await carNetwork.methods.returnRoleWithAccount(
  //     accounts[3],
  //   ).call({ from: accounts[0] });

  //   const manufacturer = await carNetwork.methods.returnRoleWithAccount(
  //     accounts[4],
  //   ).call({ from: accounts[0] });

  //   const workshop = await carNetwork.methods.returnRoleWithAccount(
  //     accounts[5],
  //   ).call({ from: accounts[0] });

  //   console.log("dealer: ", dealer)
  //   console.log("manufacturer: ", manufacturer)
  //   console.log("workshop: ", workshop);

  //   return dealerCreated && manufacturerCreated && workshopCreated
  // }

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
          <ProtectedRoute exact path="/view-car/:id" component={ViewOneCar} />
          <ProtectedRoute exact path="/view-car" component={ViewCarList} />
          <ProtectedRoute path="/transfer-ownership" component={TransferOwnership}/>
          <ProtectedRoute path="/add-car" component={AddCar}/>
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
