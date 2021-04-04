import React, { Component } from "react";
import './view-car.css';
import AccountService from "../../../services/accounts.service";

class ViewCar extends Component {
  constructor() {
    super();
    this.state = {prevOwnerList: [], serviceRecordList: []};
  }
  componentDidMount(){
    //get all prev owners' business name and UEN
    const prevOwnerList = this.props.carRecord.ownersList.filter(owner => owner !== this.props.carRecord.currOwner);
    prevOwnerList.forEach((owner, index) => {
      AccountService.getAccountWithAddress(owner)
      .on("value", snapshot => {
        snapshot.forEach((data) => {
          let userAccount = data.val();
          console.log(userAccount)
          if (userAccount) {
            const prevOwnerInformation = {
              ownerAddress: owner,
              ownerName: userAccount.name ? userAccount.name: '-',
              ownerUEN: userAccount.uen ? userAccount.uen: '-',
            };
            console.log(prevOwnerInformation)
            const tempPrevOwnerList = this.state.prevOwnerList;
            tempPrevOwnerList[index] = prevOwnerInformation;
            this.setState({
              prevOwnerList: tempPrevOwnerList
            })
            console.log(prevOwnerList.length)
            console.log(this.state.prevOwnerList.length)

            if (index + 1 === prevOwnerList.length) {
              this.setState({ dataProcessed: true})
            }
          }
        })
      })
    })
    
    //get all servicing workshop's business name and UEN
    const serviceRecordList = this.props.carRecord.serviceRecordList;
    serviceRecordList.forEach((serviceRecord, index) => {
      AccountService.getAccountWithAddress(serviceRecord.createdBy)
      .on("value", snapshot => {
        snapshot.forEach((data) => {
          let userAccount = data.val();
          console.log(userAccount)
          if (userAccount) {
            const newServiceRecord = {
              creatorAddress: serviceRecord.createdBy,
              creatorName: userAccount.name ? userAccount.name: '-',
              creatorUEN: userAccount.uen ? userAccount.uen: '-',
              createdOn: serviceRecord.createdOn,
              servicingDetails: serviceRecord.comment
            };
            console.log(newServiceRecord)
            const tempServiceRecordList = this.state.serviceRecordList;
            tempServiceRecordList[index] = newServiceRecord;
            this.setState({
              serviceRecordList: tempServiceRecordList
            })
            console.log(tempServiceRecordList.length)
            console.log(this.state.serviceRecordList.length)

            if (index + 1 === serviceRecordList.length) {
              this.setState({ dataProcessedRecord: true})
            }
          }
        })
      })
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
          {this.props.carRecord.email && <div><strong>Car Owner Email: </strong>{this.props.carRecord.email}</div>}

        </div>
        <div class="car-details-container">
          <h5>Previous Owner List</h5>
        {this.state.dataProcessed && this.state.prevOwnerList && this.state.prevOwnerList.length >= 1 &&
            <table class="table table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>No.</th>
                  <th>Owner name</th>
                  <th>Owner UEN</th>
                  <th>Owner address</th>
                </tr>
              </thead>
            {this.state.dataProcessed && this.state.prevOwnerList && this.state.prevOwnerList.length >= 1 && this.state.prevOwnerList.map((owner, index) => {
            return  (
              <tr key={index}>
                <td>{index + 1}.</td>
                <td>{owner.ownerName}</td>
                <td>{owner.ownerUEN}</td>
                <td>{owner.ownerAddress}</td>
              </tr>
            )})}
          </table>
          }
          {this.state.dataProcessed && this.state.prevOwnerList && this.state.prevOwnerList.length == 0 && 
          <div>There are no previous owners.</div>}
        </div>
        <div class="car-details-container">
          <h5>Service records</h5>
          {this.state.dataProcessedRecord && this.props.carRecord.serviceRecordList &&
            <table class="table table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>No.</th>
                  <th>Creator Name</th>
                  <th style={{width:'150px'}}>Creator UEN</th>
                  <th>Creator address</th>
                  <th>Created Date</th>
                  <th>Servicing Details</th>
                </tr>
              </thead>
            {this.state.dataProcessedRecord && this.state.serviceRecordList.map((serviceRecord, index) => {
            return  (
              <tr>
                <td>{index + 1}.</td>
                <td>{serviceRecord.creatorName}</td>
                <td>{serviceRecord.creatorUEN}</td>                
                <td>{serviceRecord.creatorAddress}</td>
                <td>{serviceRecord.createdOn}</td>
                <td>{serviceRecord.servicingDetails}</td>
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
