import React, { useState } from "react";
import "../../App.css"
import { useHistory } from "react-router-dom";
import { useAuth } from "./authprovider";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const submitLogin = async (event) => {
    event.preventDefault()
    try {
      setError("")
      setLoading(true);
      await login(username, password);
      console.log("login fired")
      history.push("/")
    } catch {
      setError("Please login with the right credentials")
    }

    setLoading(false)
  }

  return (
    <div className="container" >
      <div className="row m-5 no-gutters shadow-lg">
        <div className="col-md-7 d-none d-md-block">
          <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80" alt='car-portal' className="img-fluid" style={{ minHeight: '100%' }} />
        </div>
        <div className="col-md-5 bg-white p-5">
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

            <br/>
            <button type="submit" className="btn btn-info btn-block" onClick={submitLogin}>Submit</button>
          </form>
          <br/>
          {error && <div class="alert alert-danger" role="alert">
            {error}
          </div>}
        </div>

      </div>
    </div>
  );
}

export default Login;
