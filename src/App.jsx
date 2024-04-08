// App.js
import React,{useEffect} from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/auth';
import Router from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust URL accordingly

function App() {

  useEffect(() => {
        // Listen for notifications from the server
        socket.on('notification', (message) => {
            console.log('Notification from server:', message);
            // You can handle the notification as needed in your React app
        });

        return () => {
            // Cleanup function to remove event listener when component unmounts
            socket.off('notification');
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