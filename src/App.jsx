// App.js
import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import { AuthProvider } from "./context/auth";
import Router from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
// import io from 'socket.io-client';
import { io } from "socket.io-client";
import useAuth from "./hooks/useAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);

  const { auth } = useAuth();

  useEffect(() => {
   setSocket(io("http://localhost:10000"));
  }, []);

 
  return (
    <>
      <AuthProvider>
        <Router socket = {socket } />
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
