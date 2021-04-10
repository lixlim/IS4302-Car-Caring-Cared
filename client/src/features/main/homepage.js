import React from "react";
import Navbar from "./navbar";
import { Link } from 'react-router-dom';

const Homepage = () => {

    return (
        <>
            <Navbar />
            <div className="container">
                <div className='row mb-5' />
                    <h3 class="text-center">Welcome!</h3>
                    <h6 class="text-center">This is our blockchain-based solution that keeps all servicing records of a car.</h6>
                    <br />

                    <div style={{marginRight: '470px', marginLeft: '470px' }}>
                    <Link  to={`/marketplace`}  className="btn btn-info">Explore Marketplace</Link></div>
            </div>
        </>
    );
}

export default Homepage;