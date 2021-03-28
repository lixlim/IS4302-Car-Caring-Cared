import React, { Component } from "react";
import { useAuth } from "./authprovider";
import { Redirect } from 'react-router-dom';
import getWeb3 from "../../getWeb3";
import CarNetworkContract from "../../contracts/CarNetwork.json";

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = { user:null, isLoggedOut: false, web3: null, accounts: null, role: null };

        this.handleLogout = this.handleLogout.bind(this);
    }

    static contextType = useAuth;
    
    componentDidMount = async () => {
        this.setState({user: this.context.currentUser});
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedCarNetwork = CarNetworkContract.networks[networkId];

            const carNetworkInstance = new web3.eth.Contract(
                CarNetworkContract.abi,
                deployedCarNetwork && deployedCarNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, carNetwork: carNetworkInstance }, this.getRoles);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    getRoles = async() => {
        console.log("getRoles");
        const { accounts, carNetwork } = this.state;
        const role = await carNetwork.methods.returnRoleWithAccount(
            accounts[0],
        ).call({ from: accounts[0]});
        this.setState({role:role});
    }


    handleLogout = async () => {
        try {
            await this.context.logout
            console.log("logout fired")
            this.setState({ isLoggedOut: true })
        } catch (error) {
            alert('Logout Failed')
        }
    }

    render() {

        if (this.state.isLoggedOut) {
            return <Redirect to="/login" />
        }

        let menu;

        if (this.state.role === 'Manufacturer') {
            menu = (
                <>
                    <a className="nav-item nav-link" href="/">Create car</a>
                    <a className="nav-item nav-link" href="/viewCar">View list of cars created</a>
                    <a className="nav-item nav-link" href="/">Search car</a>
                    <a className="nav-item nav-link" href="/">Marketplace</a>
                    <a className="nav-item nav-link" href="/">Transfer ownership</a>
                </>
            );
        } else if (this.state.role === 'Dealer') {
            menu = (<>
                <a className="nav-item nav-link" href="/">Search car</a>
                <a className="nav-link" href="/viewCar">View list of cars owned</a>
                <a className="nav-item nav-link" href="/">Marketplace</a>
                <a className="nav-item nav-link" href="/">Transfer ownership</a>
            </>);
        } else if (this.state.role === 'Workshop') {
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
                        <li className="nav-item" style={{ color: "#ffffff", paddingLeft: "30px" }}>Signed in as {this.user && this.user.email}</li>
                        <br />
                        {menu}

                        <button className="btn btn-link pl-0 text-left" style={{ color: "#b8b8b8" }} type="submit" onClick={this.handleLogout}>Logout</button>
                    </div>

                </div>

            </nav>
        );
    }
}

export default Navbar;