import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Login from './features/main/login';
import ViewCar from './features/car/view-car';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/view-car" component={ViewCar}/>
          <Route path="/" component={Login}/>
        </Switch>
      </BrowserRouter>
    );
  }
};

export default App;
