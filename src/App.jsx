// App.js
import { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AuthProvider } from "./context/auth";
import Router from "./routes";
// import io from 'socket.io-client';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
// import useAuth from "./hooks/useAuth";

function App() {
  // const [username, setUsername] = useState("");
  // const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);

  // const { auth } = useAuth();

  useEffect(() => {
    const socket = io("https://zoofi-393f46d84893.herokuapp.com");

    // const socket = io("http://localhost:10000");

    socket.on("connect", () => {
      console.log("Socket connected successfully");
      setSocket(socket);
     // settingSocket(socket);
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

  // function settingSocket() {
  //   setSocket(socket);
  // }

  return (
    <>
      <AuthProvider>
        <Router socket={socket} />
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
