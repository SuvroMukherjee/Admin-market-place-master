
import React from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {

    const { auth } = useAuth();
    const location = useLocation();

    console.log({ auth })

    return (

        allowedRoles.includes(auth?.role?.name)
            ? <Outlet />
            : auth?.username
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/" state={{ from: location }} replace />

    )
}

export default RequireAuth