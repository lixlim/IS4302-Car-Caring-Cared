import React, { Component } from "react";
import "../../App.css"
import firebase from "firebase/app";
import { Redirect, useHistory } from "react-router-dom";

const Login = () => {

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const history = useHistory();

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const submitLogin = (event) => {
    event.preventDefault();
    firebase.auth().signInWithEmailAndPassword(username,password)
    .then(async res => {
      if (res.user) {
        sessionStorage.setItem('isLoggedIn', 'true');
        history.push(`/`);
      } else {
        alert("Please check your credentials");
      }
    }).catch(err => console.error(err))
  }

    return (
      <div className="container" >
        <div className="row m-5 no-gutters shadow-lg">
          <div className="col-md-7 d-none d-md-block">
            <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80" className="img-fluid" style={{ minHeight: '100%' }} />
          </div>
          <div className="col-md-5 bg-white p-5">
            <br />
            <h1 className="pb-3">Login</h1>
            
            <form>
              <br />
              <br />

              <div className="form-group pb-3">
                <label>Username</label>
                <input type="text" className="form-control" placeholder="Enter Username" onChange={handleUsername} />
              </div>

              <div className="form-group pb-3">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter Password" onChange={handlePassword} />
              </div>

              <br />

              <button type="submit" className="btn btn-primary btn-block" onClick={submitLogin}>Submit</button>
            </form>
          </div>

        </div>
      </div>
    );
}

export default Login;
