import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../main/navbar";

class ViewOneCar extends Component {


    render() {

        let carId = this.props.match.params.id;
        //const { car } = this.state;

        return (
            <div>
                <Navbar />
                <div class="container">
                    <div class='row mb-5' />
                    <h3>Viewing Car Id {carId}</h3>

                    <br />
            Servicing records for #Car Name#
            <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Servicing Record Num</th>
                                <th>Done By</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><button onClick={() => console.log(123)} class="btn btn-primary">view more</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ViewOneCar;