import React, { Component } from "react";
import Navbar from "./navbar";
import { Redirect } from "react-router-dom";
import AccountService from "../../services/accounts.service";

const Testpage = () => {

    const createAccountOnly = () => {
        var uid = "exampleuid"
        var info = {
            accountAddress: "0x8fD00f170FDf3772C5ebdCD90bF257316c69BA46"
        }
        AccountService.createAccount(uid, info)
            .then((res) => {
                console.log("Created new account successfully!");
                console.log(res)
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const createBusinessAccount = () => {
        var uid = "manufactureruid"
        var info = {
            accountAddress: "0x8fD00f170FDf3772C5ebdCD90bF257316c69BA40",
            name: "BMW",
            uen: "201810231W"
        };
        AccountService.createAccount(uid, info)
            .then((res) => {
                console.log("Created new business account successfully!");
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
                <button type="submit" className="btn btn-info btn-block" onClick={createAccountOnly}>Submit</button>
                Create manufacturer user with uen and name info
                <button type="submit" className="btn btn-info btn-block" onClick={createBusinessAccount}>Submit</button>
            </div>

        </>
    );
}

export default Testpage;