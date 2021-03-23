import React, { Component } from "react";
import Navbar from "./navbar";
import {Redirect} from "react-router-dom";

class Homepage extends Component {
    render() {
        return (
            <div className="container">
                <Navbar />
                <h1 className="pb-3">Welcome</h1>
            </div>
        );
    }
}

export default Homepage;