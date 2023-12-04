// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Login/LoginPage';
import Home from './Pages/Home/Home';
import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css'
import UserList from './Pages/UserList/UserList';
import Roles from './Pages/Roles/Roles';
import Layout from './components/Layout/Layout';
import RequireAuth from './components/RequireAuth/RequireAuth';


function App() {
  return (
    <Router>
      <Topbar />
      <div className="container">

        <Sidebar />
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/roles" element={<Roles />} /> */}


          <Route path='/' element={<Layout />}>
            {/** public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/** protected routes */}
            <Route element={<RequireAuth />} >
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/roles" element={<Roles />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>

  );
}

export default App;