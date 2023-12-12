// App.js
import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/auth';
import Router from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <>
      <AuthProvider>
          <Router />
      </AuthProvider>

    </>

  );
}

export default App;