import { useRoutes } from 'react-router-dom';
import AdminLayout from './Layouts/AdminLayout';
import LoginPage from './Login/LoginPage';
import Home from './Pages/Home/Home';
import {Roles} from './Pages/Roles/Roles';
import UserList from './Pages/UserList/UserList';
import Topbar from './components/Topbar/Topbar';
import useAuth from './hooks/useAuth';
import AddUser from './Pages/AddUser/AddUser';



export default function Router() {

    const { auth } = useAuth();

    let allRoutes = [];

    if (!auth) {
        allRoutes = [
            {
                path: '/',
                element: <Topbar />,
                children: [
                    { path: 'login', element: <LoginPage /> },
                ]
            },
        ]
    } else {
        allRoutes = [
            {
                path: '/',
                element: <AdminLayout />,
                children: [
                    { path: 'AdminDashboard', element: <Home /> },
                    { path: 'roles', element: <Roles /> },
                    { path: 'users', element: <UserList /> },
                    { path: 'AddUser', element: <AddUser /> },

                ]
            },
        ]
    }





    return useRoutes(allRoutes);
}
