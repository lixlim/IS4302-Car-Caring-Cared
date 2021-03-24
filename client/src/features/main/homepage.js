import React, { Component } from "react";
import Navbar from "./navbar";
import { Redirect } from "react-router-dom";

const Homepage = () => {
    return (
        <>
            <Navbar />
            <div class="container">
                <div class='row mb-5' />
                    <h3>Homepage</h3>
                    <p>What should we display here.</p>
            </div>
        </>
    );
}

export default Homepage;