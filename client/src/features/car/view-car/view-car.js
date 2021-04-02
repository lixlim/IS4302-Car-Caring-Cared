import React, { Component } from "react";
import './view-car.css';
import Navbar from "../../main/navbar";

class ViewCar extends Component {
  state = {prevOwnerList: null};

  componentDidMount() {
    this.setState({
      prevOwnerList: this.props.carRecord.ownersList.filter(owner => owner !== this.props.carRecord.currOwner)
    })
  }
  render() {
    return (
      <div>  
        <div class="car-details-container">
          <h5>Car information</h5>
          <div><strong>Car Model: </strong> {this.props.carRecord.carModel}</div> 
          {this.props.carRecord.carPrice && <div><strong>Car Price: </strong>${this.props.carRecord.carPrice}</div>}
          <div><strong>Car Owner Address: </strong> {this.props.carRecord.currOwner}</div> 
        </div>
        <div class="car-details-container">
          <h5>Previous Owner List</h5>
        {this.state.prevOwnerList && this.state.prevOwnerList.length >= 1 &&
            <table class="table table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>No.</th>
                  <th>Owner address</th>
                </tr>
              </thead>
            {this.state.prevOwnerList && this.state.prevOwnerList.length >= 1 && this.state.prevOwnerList.map((owner, index) => {
            return  (
              <tr>
                <td>{index + 1}</td>
                <td>{owner}</td>
              </tr>
            )})}
          </table>
          }
          {this.state.prevOwnerList && this.state.prevOwnerList.length == 0 && 
          <div>There are no previous owners.</div>}
        </div>
        <div class="car-details-container">
          <h5>Service records</h5>
          {this.props.carRecord.serviceRecordList &&
            <table class="table table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>No.</th>
                  <th>Created By</th>
                  <th>Created On</th>
                  <th>Servicing Details</th>
                </tr>
              </thead>
            {this.props.carRecord.serviceRecordList && this.props.carRecord.serviceRecordList.map((serviceRecord, index) => {
            return  (
              <tr>
                <td>{index + 1}</td>
                <td>{serviceRecord.createdBy}</td>
                <td>{serviceRecord.createdOn}</td>
                <td>{serviceRecord.comment}</td>
              </tr>
            )})}
          </table>
          }
        </div>
      </div>
    );
  }
}

export default ViewCar;
