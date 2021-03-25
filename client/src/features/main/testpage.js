import React, { Component } from "react";
import Navbar from "./navbar";
import { Redirect } from "react-router-dom";
import AccountService from "../../services/accounts.service";

const Testpage = () => {

    const create = () => {
        var uid = "exampleuid"
        var accountAddress = "0x8fD00f170FDf3772C5ebdCD90bF257316c69BA45";
        AccountService.create(uid, accountAddress)
            .then((res) => {
                console.log("Created new account successfully!");
                console.log(res)
            })
            .catch((e) => {
                console.log(e);
            });
    }

    return (
        <>
            <Navbar />
            <div class="container">
                <div class='row mb-5' />
                Create user with ether account address
                <button type="submit" className="btn btn-info btn-block" onClick={create}>Submit</button>
            </div>

        </>
    );
}

export default Testpage;