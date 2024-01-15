import { createContext, useState } from "react";
import { getLocationForLogout } from "../Pages/KeyManager/Dashboard/LogoutTrack";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : null;
    });

    const logout = async() => {
        // Clear the authentication data from localStorage and reset auth state
 
        console.log({auth})
        if (auth?.role?.name == "Key Account Maneger"){
           let res = await getLocationForLogout();
            if (res?.error == false){
               localStorage.removeItem('auth');
               localStorage.removeItem('ACCESS_TOKEN');
               localStorage.clear();
               setAuth(null);
           }
           
        } else if (auth?.role?.name != "Key Account Maneger"){
            localStorage.removeItem('auth');
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.clear();
            setAuth(null);
        }
    };


    return (
        <AuthContext.Provider value={{ auth, setAuth,logout  }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;