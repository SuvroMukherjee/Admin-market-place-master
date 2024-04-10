// App.js
import React,{useEffect, useState} from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import { AuthProvider } from "./context/auth";
import Router from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
// import io from 'socket.io-client';
import { io } from 'socket.io-client';
import { socket } from './socket';



function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      console.warn({ value });
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat message', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

   
 

  return (
    <>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </>
  );
}

export default App;
