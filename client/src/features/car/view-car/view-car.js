import React, { Component } from "react";
import './view-car.css';

class ViewCar extends Component {

  render() {
    return (
      <div>  
        <div class="car-details-container">
          <h5>Car information</h5>
          <div>Car Model: {this.props.carRecord.carModel}</div> 
          <div>Car owner address: {this.props.carRecord.currOwner}</div> 
        </div>
        <div>
          <h5>Owner list</h5>
        {this.props.carRecord.ownersList &&
            <table class="table table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>No.</th>
                  <th>Owner address</th>
                </tr>
              </thead>
            {this.props.carRecord.ownersList && this.props.carRecord.ownersList.map((owner, index) => {
            return  (
              <tr>
                <td>{index + 1}</td>
                <td>{owner}</td>
              </tr>
            )})}
          </table>
          }
        </div>
        <div>
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
