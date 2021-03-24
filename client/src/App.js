import React from "react";
import { Switch, Route, BrowserRouter, } from "react-router-dom";
import Login from './features/main/login';
import Homepage from './features/main/homepage';
import ViewCar from './features/car/view-car';
import firebase from "firebase/app";
import firebaseConfig from "./firebase";
import ProtectedRoute from "./features/main/protectedroute";
import { AuthProvider } from "./features/main/authprovider";

const firebaseInstance = firebase.initializeApp(firebaseConfig);

const App = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Route path='/login' component={Login} />
        <ProtectedRoute exact path="/" component={Homepage} />
        <ProtectedRoute exact path="/view-car" component={ViewCar} />
      </AuthProvider>
    </BrowserRouter>

  );
};

export default App;
