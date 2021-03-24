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
            <div>
                <li class="nav-item">
                    <a class="nav-link" href="#">Create car</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">View list of cars created</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/view-car">View car</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Add car part</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Transfer ownership</a>
                </li>
            </div>
        );
    } else if (sessionStorage.getItem('role') === 'Dealer') {
        menu = (<div>
            <li class="nav-item">
                <a class="nav-link" href="#">View list of cars owned</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">View car</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" tabindex="-1">Transfer ownership</a>
            </li>
        </div>);
    } else if (sessionStorage.getItem('role') === 'Workshop') {
        menu = (<div>
            <li class="nav-item">
                <a class="nav-link" href="#">Create service record</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">View car</a>
            </li>
        </div>)
    } else {
        menu = (<div>
            <li class="nav-item">
                <a class="nav-link" href="#">View list of cars owned</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">View car</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Transfer ownership</a>
            </li>
        </div>);
    }

    return (
        <nav class="navbar navbar-default navbar-static-top">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" href="#">WebSiteName</a>

                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <sapn class="icon-bar"></sapn>
                    </button>
                </div>
                <ul class="nav navbar-nav navbar-right collapse navbar-collapse">
                    <li class="active"><a href="#">Home</a></li>
                    <li><a href="#">Page 1</a></li>
                    <li><a href="#">Page 2</a></li>
                    <li><a href="#">Page 3</a></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;