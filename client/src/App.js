import React, { Component } from "react";
import { Switch, Route, BrowserRouter, Redirect, useHistory } from "react-router-dom";
import Login from './features/main/login';
import Homepage from './features/main/homepage';
import ViewCar from './features/car/view-car';
import firebase from "firebase/app";
import firebaseConfig from "./firebase";
import ProtectedRoute from "./features/main/protectedroute"

class App extends Component {

  componentDidMount() {
    const firebaseInstance = firebase.initializeApp(firebaseConfig);
    // let isLoggedIn = firebase.auth().onAuthStateChanged(function (user) {
    //   if (user) {
    //     sessionStorage.setItem('username', user.email);
    //   }
    // })
  }

  render() {

    return (
      <BrowserRouter>
        <Route path='/login' component={Login} />
        <ProtectedRoute exact={true} path="/" component={Homepage} />
        <ProtectedRoute path="/view-car" component={ViewCar} />
        <ProtectedRoute component={Homepage} />
      </BrowserRouter>
    );
  }
};

export default App;
