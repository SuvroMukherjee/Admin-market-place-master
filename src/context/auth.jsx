import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : null;
    });

    const logout = () => {
        // Clear the authentication data from localStorage and reset auth state
        localStorage.removeItem('auth');
        setAuth(null);
    };


    return (
        <AuthContext.Provider value={{ auth, setAuth,logout  }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;