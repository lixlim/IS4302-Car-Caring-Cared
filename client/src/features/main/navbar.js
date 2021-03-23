import React, { Component } from "react";
import firebase from 'firebase/app';
import { useHistory, Redirect } from "react-router";

class Navbar extends Component {

    handleLogout(event) {
        const history = useHistory();
        firebase.auth().signOut()
        .then(res => {
            console.log(res);
            sessionStorage.clear();
            sessionStorage.setItem('isLoggedIn', 'false');
            history.push("/");
        }).catch(err => console.error(err))
    }

    render() {

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
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Navbar</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            {menu}
                        </ul>
                        <form class="form-inline my-2 my-lg-0">
                            <span class="navbar-text">Signed in as {sessionStorage.getItem('username')}</span>
                            <button class="btn btn-outline-primary my-2 my-sm-0" type="submit" onClick={this.handleLogout}>Logout</button>
                        </form>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;