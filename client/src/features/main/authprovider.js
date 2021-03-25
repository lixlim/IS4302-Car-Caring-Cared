import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

function login(username, password) {
    return firebase.auth().signInWithEmailAndPassword(username, password);
}

function logout() {
    return firebase.auth().signOut();
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user)
            firebase.database.child("accounts").child(user.uid).get().then(function(snapshot) {
                if (snapshot.exists()) {
                  console.log(snapshot.val());
                  setUserInfo(snapshot.val());
                }
                else {
                  console.log("No data available");
                }
              }).catch(function(error) {
                console.error(error);
              });
            setLoading(false)
        })

        return unsubscribe;
    }, [])

    const value = { currentUser, login, logout, userInfo }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}