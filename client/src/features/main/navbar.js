import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "./authprovider";

const Navbar = () => {

    const { currentUser, logout, userInfo } = useAuth();
    const history = useHistory();

    const handleLogout = async () => {
        try {
            await logout()
            console.log("logout fired")
            history.push('/login')
        } catch (error) {
            alert('Logout Failed')
        }
    }

    let menu;

    if (sessionStorage.getItem('role') === 'Manufacturer') {
        menu = (
            <>
                <a className="nav-item nav-link" href="/">Create car</a>
                <a className="nav-item nav-link" href="/viewCar">View list of cars created</a>
                <a className="nav-item nav-link" href="/">Search car</a>
                <a className="nav-item nav-link" href="/">Marketplace</a>
                <a className="nav-item nav-link" href="/">Transfer ownership</a>
            </>
        );
    } else if (sessionStorage.getItem('role') === 'Dealer') {
        menu = (<>
            <a className="nav-item nav-link" href="/">Search car</a>
            <a className="nav-link" href="/viewCar">View list of cars owned</a>
            <a className="nav-item nav-link" href="/">Marketplace</a>
            <a className="nav-item nav-link" href="/">Transfer ownership</a>
        </>);
    } else if (sessionStorage.getItem('role') === 'Workshop') {
        menu = (<div>
            <a className="nav-link" href="/">Create service record</a>
            <a className="nav-link" href="/viewCar/:id">Search car</a>
        </div>)
    } else {
        menu = (<>
            <a className="nav-item nav-link" href="/">Search car</a>
            <a className="nav-item nav-link" href="/viewCar">View list of cars owned</a>
            <a className="nav-item nav-link" href="/">Marketplace</a>
            <a className="nav-item nav-link" href="/">Transfer ownership</a>
        </>
        );
    }

    return (
        <nav className="navbar navbar-dark bg-dark">
            <a className="navbar-brand mb-0 h2" href="/">Car-caring-cared</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <br />
                    <li className="nav-item" style={{ color: "#ffffff" }}>Your Profile</li>
                    <li className="nav-item" style={{ color: "#ffffff", paddingLeft: "30px" }}>Signed in as {userInfo && userInfo.name}</li>
                    <li className="nav-item" style={{ color: "#ffffff", paddingLeft: "30px" }}>Ether account is {userInfo && userInfo.accountAddress}</li>
                    <br />
                    {menu}

                    <button className="btn btn-link pl-0 text-left" style={{ color: "#b8b8b8" }} type="submit" onClick={handleLogout}>Logout</button>
                </div>

            </div>

        </nav>
    );
}

export default Navbar;