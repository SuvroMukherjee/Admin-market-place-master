import { useRoutes } from 'react-router-dom';
import AdminLayout from './Layouts/AdminLayout';
import LoginPage from './Login/LoginPage';
import AddUser from './Pages/AddUser/AddUser';
import Home from './Pages/Home/Home';
import { Roles } from './Pages/Roles/Roles';
import UserList from './Pages/UserList/UserList';
import useAuth from './hooks/useAuth';
import RequireAuth from './components/RequireAuth/RequireAuth'


export default function Router() {

  
    const allRoutes = [
        {
            path: '/',
            element: <AdminLayout />,
            children: [
                {
                    path: '/',
                    element: <RequireAuth allowedRoles={['656d6fca298f781cbdd844bd']} />,
                    children: [
                        { path: 'AdminDashboard', element: <Home /> },
                        { path: 'roles', element: <Roles /> },
                        { path: 'users', element: <UserList /> },
                        { path: 'AddUser', element: <AddUser /> },
                    ],
                },
            ],
        },
        {
            path: '/login',
            element: <LoginPage />,
        },
    ];




    return useRoutes(allRoutes);
}
