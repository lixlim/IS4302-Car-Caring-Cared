import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app'; 

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

function login(username, password) {
    return firebase.auth().signInWithEmailAndPassword(username,password);
}

function logout() {
    return firebase.auth().signOut();
}

export function AuthProvider({children}) {
    
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)    
        })
        return unsubscribe;
    }, [])

    const value = {currentUser, login, logout}
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}