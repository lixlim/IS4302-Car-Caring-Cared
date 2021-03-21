import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Login from './features/main/login/login';
import AddCar from './features/car/add-car/add-car';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/add-car" component={AddCar}/>
          <Route path="/" component={Login}/>
        </Switch>
      </BrowserRouter>
    );
  }
};

export default App;
