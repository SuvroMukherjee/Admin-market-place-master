import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import useAuth from './hooks/useAuth';



export default function Router() {

    const { auth } = useAuth();

    let allRoutes = [];

    if (!auth) {
        allRoutes = [
            {
                path: '/',
                element: <h1>This is Home Page <Outlet /> </h1>,
                children: [
                    { path: 'login', element: <h2>Login Page</h2> },
                ]
            },
        ]
    } else {
        allRoutes = [
            {
                path: '/',
                element: <h1>This is Home Page <Outlet /> </h1>,
                children: [
                    { path: 'AdminDashboard', element: <h2>Dashboard Page</h2> },
                    { path: 'role', element: <h2>Role Page</h2> },
                    { path: 'AdminDashboard', element: <h2>Dashboard Page</h2> },
                    { path: 'AdminDashboard', element: <h2>Dashboard Page</h2> },

                ]
            },
        ]
    }





    return useRoutes(allRoutes);
}
