// App.js
import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import { AuthProvider } from "./context/auth";
import Router from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
// import io from 'socket.io-client';
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "./hooks/useAuth";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);

  const { auth } = useAuth();

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", auth?.email);
  }, [socket, user]);

  const send = () => {
    console.log("Sending notification...");
    socket.emit("sendNotification", {
      senderName: "user",
      receiverName: "marketplace.admin@gmail.com",
      type: "1000",
    });
  };

  return (
    <>
      <AuthProvider>
        <button
          onClick={() => send()}
          style={{
            height: "50vh",
            width: "800px",
            background: "blue",
            color: "white",
          }}
        >
          Click
        </button>
        <Router socket={socket} />
      </AuthProvider>
    </>
  );
}

export default App;
