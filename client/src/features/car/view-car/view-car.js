import React, { Component } from "react";
import SimpleStorageContract from "../../../contracts/SimpleStorage.json";
import getWeb3 from "../../../getWeb3";
import Navbar from "../main/navbar";

class ViewCar extends Component {

  render() {
    return (
      <>
        <Navbar />
        <div class="container">
          <div class='row mb-5' />
          <h3>View Car</h3>
          <p>Display all car details here.</p>
        </div>
      </>
    );
  }
}

export default ViewCar;
