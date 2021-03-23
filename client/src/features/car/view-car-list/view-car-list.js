import React, { Component } from "react";
import "./view-car-list.css";


class ViewCarList extends Component {
    state = {totalCar: 2, cars: [{name: "car1", carId: "12345", owner: "tom"}, {name: "car2", carId: "00001", owner: "tom"}]};

    componentDidMount = async () => {
        //this.setState({totalCar: 2, cars: {car1: {name: "car1", carId: "12345", owner: "tom"}, car2: {name: "car2", carId: "00001", owner: "tom"}}});
        console.log(this.state);
    }

    
    render() {

        const { totalCar, cars } = this.state;

        return (
        <div class="container">
            { totalCar > 0  &&
            <label>
                <div> Total Cars owned: { totalCar} </div>
            </label>
            }
            {cars &&
                <table class="table">
                <thead class="table-dark">
                    <tr>
                        <th>Car ID</th>
                        <th>name</th>
                        <th>Owner</th>
                        <th></th>
                    </tr>
                </thead>
                {cars.map(car =>
                <tr>
                    <td>{car.carId}</td>
                    <td>{car.name}</td>
                    <td>{car.owner}</td>
                    <td><button onClick={() => console.log(car.carId)} class="btn btn-primary">view more</button></td>
                </tr>
                )}
            </table>
            }
            <p>
            {this.state.totalCar}
            </p>
        </div>
    );  
  }
}

export default ViewCarList;