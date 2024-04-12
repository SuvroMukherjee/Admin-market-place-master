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
    const socket = io("https://zoofi-393f46d84893.herokuapp.com");

    socket.on("connect", () => {
      console.log("Socket connected successfully");
      setSocket(socket);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      // Optionally handle the error here, such as displaying a message to the user or retrying after a delay
    });

    // Clean up the socket on component unmount
    return () => {
      console.log("Cleaning up socket connection");
      socket.disconnect();
    };
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
