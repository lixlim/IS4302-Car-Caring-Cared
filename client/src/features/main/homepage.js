import React from "react";
import { useAuth } from "./authprovider";
import Navbar from "./navbar";

const Homepage = () => {

    const {currentUser} = useAuth();
    console.log("In homepage");
    console.log(currentUser);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className='row mb-5' />
                    <h3>Signed In as {currentUser && currentUser.email} </h3>
            </div>
        </>
    );
}

export default Homepage;