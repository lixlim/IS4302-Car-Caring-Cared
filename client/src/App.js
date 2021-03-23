import React, { Component } from "react";
import { Switch, Route, BrowserRouter, Redirect, useHistory } from "react-router-dom";
import Login from './features/main/login';
import Homepage from './features/main/homepage';
import ViewCar from './features/car/view-car';
import firebase from 'firebase/app';
import firebaseConfig from "./firebase";

class App extends Component {
  
  componentDidMount() {
    const firebaseInstance = firebase.initializeApp(firebaseConfig);
    const history = useHistory;
    sessionStorage.setItem('isLoggedIn', 'false');
    let isLoggedIn = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', user.email);
      }
    })
  }

  render() {

    let routes;

    // <Redirect to="/home" /> must be kept at the bottom
    if (sessionStorage.getItem('isLoggedIn', 'true')) {
      routes = (<Switch>
        <Route path='/home' component={Homepage} />
        <Route path="/view-car" component={ViewCar} />
        <Redirect to="/home" /> 
      </Switch>)
    } else {
      routes = (<Switch>
          <Route path='/login' component={Login} />
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>)
    }
    return (
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    );
  }
};

export default App;
