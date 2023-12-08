import React from 'react'
import Topbar from '../components/Topbar/Topbar'
import Sidebar from '../components/Sidebar/Sidebar'
import Home from '../Pages/Home/Home'
import { Outlet } from 'react-router-dom'
const AdminLayout = () => {
    return (
        <div>
            <div>
                <Topbar />
            </div>
            <div className="containerLayout">
                <Sidebar />
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout