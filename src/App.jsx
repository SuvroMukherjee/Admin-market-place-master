// App.js
import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/auth';
import Router from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastProvider } from 'react-hot-toast';

function App() {
  return (
    <>
      <AuthProvider>
        <ToastProvider>
          <Router />
        </ToastProvider>
      </AuthProvider>

    </>

  );
}

export default App;