import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Login from './features/main/login/login';
import ViewCarList from './features/car/view-car-list/view-car-list';
import ViewOneCar from './features/car/view-car-list/view-car';
class App extends Component {
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <Switch>
            <Route path="/viewCar/:id" component={ViewOneCar} />
            <Route path="/viewCar" component={ViewCarList}/>
            <Route path="/" component={Login}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
};

export default App;
