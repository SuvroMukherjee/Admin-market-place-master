// App.js
import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Login/LoginPage';
import Home from './Pages/Home/Home';
import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css'
import UserList from './Pages/UserList/UserList';
import Roles from './Pages/Roles/Roles';
import Layout from './components/Layout/Layout';
import RequireAuth from './components/RequireAuth/RequireAuth';
import Router from './routes';
import { AuthProvider } from './context/auth';

function App() {
  return (
    // <Router>
    //   <Topbar />
    //   <div className="container">

    //     <Sidebar />
    //     <Routes>
    //       <Route path='/' element={<Layout />}>
    //         {/** public routes */}
    //         <Route path="/login" element={<LoginPage />} />



    //         {/** protected routes */}
    //         <Route element={<RequireAuth allowedRoles={["656d6fca298f781cbdd844bd"]} />} >
    //           <Route path="/" element={<Home />} />
    //         </Route>
    //         <Route element={<RequireAuth allowedRoles={["656d6fca298f781cbdd844bd"]} />} >
    //           <Route path="/users" element={<UserList />} />
    //         </Route>
    //         <Route element={<RequireAuth allowedRoles={["656d6fca298f781cbdd844bd"]} />} >
    //           <Route path="/roles" element={<Roles />} />
    //         </Route>


    //         {/* <Route path="/users" element={<UserList />} />
    //         <Route path="/roles" element={<Roles />} /> */}

    //       </Route>
    //     </Routes>
    //   </div>
    // </Router>

    <>
      <AuthProvider>
        <Router />
      </AuthProvider>

    </>

  );
}

export default App;