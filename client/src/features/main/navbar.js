import React, { Component } from "react";
import firebase from 'firebase/app';
import { useHistory, Redirect } from "react-router";
import { useAuth } from "./authprovider";

const Navbar = () => {

    const { currectUser, logout } = useAuth();
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
                <a class="nav-item nav-link" href="#">Create car</a>
                <a class="nav-item nav-link" href="#">View list of cars created</a>
                <a class="nav-item nav-link" href="/view-car">View car</a>
                <a class="nav-item nav-link" href="#">Add car part</a>
                <a class="nav-item nav-link" href="#">Transfer ownership</a>
            </>
        );
    } else if (sessionStorage.getItem('role') === 'Dealer') {
        menu = (<>
            <a class="nav-link" href="#">View list of cars owned</a>
            <a class="nav-link" href="/view-car">View car</a>
            <a class="nav-link" href="#">Transfer ownership</a>
        </>);
    } else if (sessionStorage.getItem('role') === 'Workshop') {
        menu = (<div>
            <li class="nav-item">
                <a class="nav-link" href="#">Create service record</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/view-car">View car</a>
            </li>
        </div>)
    } else {
        menu = (<>
            <a class="nav-item nav-link" href="#">View list of cars owned</a>
            <a class="nav-item nav-link" href="/view-car">View car</a>
            <a class="nav-item nav-link" href="#">Transfer ownership</a>
        </>
        );
    }

    return (
        <nav class="navbar navbar-dark bg-dark">
            <a class="navbar-brand mb-0 h2" href="/">Car-caring-cared</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    {menu}
                    <form class="form-inline my-2 my-lg-0">
                        <button class="btn btn-outline-light btn-sm" type="submit" onClick={handleLogout}>Logout</button>
                    </form>
                </div>

            </div>

        </nav>
    );
}

export default Navbar;