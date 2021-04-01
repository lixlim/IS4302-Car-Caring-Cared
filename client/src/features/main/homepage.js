import React from "react";
import Navbar from "./navbar";

const Homepage = () => {
    return (
        <>
            <Navbar />
            <div className="container">
                <div className='row mb-5' />
                    <h3>Homepage</h3>
                    <p>What should we display here.</p>
            </div>
        </>
    );
}

export default Homepage;