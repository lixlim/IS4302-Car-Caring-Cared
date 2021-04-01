import React, { Component } from "react";
import Navbar from "./navbar";
import { Redirect } from "react-router-dom";
import AccountService from "../../services/accounts.service";

const Testpage = () => {

    const createAccountOnly = () => {
        var uid = "tKzSuApBmffBzvoOVJb7oAwyEiy2"
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
        var uid = "ENqGv5bdRTY5VcrGpaEkRvXfixr1"
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
    const getAccountWithUid = () => {
        var uid = "tKzSuApBmffBzvoOVJb7oAwyEiy2"
        AccountService.getAccountWithUid(uid)
            .then(function (snapshot) {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                }
                else {
                    console.log("No data available");
                }
            }).catch(function (error) {
                console.error(error);
            });
    }

    const getAccountWithAddress = () => {
        var accountAddress = "0x8fD00f170FDf3772C5ebdCD90bF257316c69BA46";
        AccountService.getAccountWithAddress(accountAddress)
        .on("value", function(snapshot) {
            console.log('To get all account info: ');
            console.log(snapshot.val());
            snapshot.forEach(function(data) {
                console.log('To get the uid: ' + data.key);
            });
        })
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
                Get info with uid
                <button type="submit" className="btn btn-info btn-block" onClick={getAccountWithUid}>Submit</button>
                Get info with ether address
                <button type="submit" className="btn btn-info btn-block" onClick={getAccountWithAddress}>Submit</button>
            </div>

        </>
    );
}

export default Testpage;