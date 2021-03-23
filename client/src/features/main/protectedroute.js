import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

class ProtectedRoute extends Component {

    render() {
        const Component = this.props.component;
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') ? 'true' : 'false';

        return isLoggedIn ? (<Component />) : <Redirect to={{pathname: '/login'}} />;
    }
}

export default ProtectedRoute;