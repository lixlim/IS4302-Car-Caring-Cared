import React from "react";
import { Switch, Route, BrowserRouter, } from "react-router-dom";
import Login from './features/main/login';
import Homepage from './features/main/homepage';
import firebase from "firebase/app";
import firebaseConfig from "./firebase";
import ProtectedRoute from "./features/main/protectedroute";
import { AuthProvider } from "./features/main/authprovider";
import ViewCarList from './features/car/view-car-list/view-car-list';
import ViewOneCar from './features/car/view-car-list/view-car';

const firebaseInstance = firebase.initializeApp(firebaseConfig);

const App = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Route path='/login' component={Login} />
        <ProtectedRoute exact path="/" component={Homepage} />
        <ProtectedRoute exact path="/viewCar/:id" component={ViewOneCar} />
        <ProtectedRoute exact path="/viewCar" component={ViewCarList} />
      </AuthProvider>
    </BrowserRouter>

  );
};

export default App;
