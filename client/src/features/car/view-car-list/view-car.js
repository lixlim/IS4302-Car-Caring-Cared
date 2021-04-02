import React, { Component } from "react";
import ViewCar from "../view-car/view-car"
import Navbar from "../../main/navbar";

class ViewOneCar extends Component {

    constructor(props) {
        super(props);
        console.log(props)
        this.state = props.location.state && this.props.match.params.id ? { carRecord: props.location.state.carRecord}:
        { carRecord: null};
    }

    
    
    render() {
        return (
            <>
            <Navbar/>
            <div class="main">
                {this.state.carRecord && !this.state.carRecord.carPrice &&
                    <>
                        <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="/view-car">Car List</a></li>
                            <li class="breadcrumb-item active" aria-current="page">{this.state.carRecord.vin}</li>
                        </ol>
                        </nav>
                        <h1>View Car Details </h1> 
                        <ViewCar carRecord={this.state.carRecord}/>
                    </>
                }
                 {this.state.carRecord && this.state.carRecord.carPrice &&
                    <>
                        <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="/marketplace">Marketplace</a></li>
                            <li class="breadcrumb-item active" aria-current="page">{this.state.carRecord.vin}</li>
                        </ol>
                        </nav>
                        <h1>View Car Details </h1> 
                        <ViewCar carRecord={this.state.carRecord}/>
                    </>
                }
            </div>
            </>
    );  
  }
}

export default ViewOneCar;