import React from "react";
import { Switch, Route, BrowserRouter, } from "react-router-dom";
import Login from './features/main/login';
import Homepage from './features/main/homepage';
import ViewCar from './features/car/view-car';
import Testpage from './features/main/testpage';
import ProtectedRoute from "./features/main/protectedroute";
import { AuthProvider } from "./features/main/authprovider";

const App = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Route path='/login' component={Login} />
        <ProtectedRoute exact path="/" component={Homepage} />
        <ProtectedRoute exact path="/test" component={Testpage} />
        <ProtectedRoute exact path="/view-car" component={ViewCar} />
      </AuthProvider>
    </BrowserRouter>

  );
};

export default App;
