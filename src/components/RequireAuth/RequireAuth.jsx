
import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    let componentToRender;

    switch (true) {
        case allowedRoles.includes(auth?.role?.name):
            componentToRender = <Outlet />;
            break;
        case !auth?.email:
            componentToRender = (
                <Navigate to="/unauthorized" state={{ from: location }} replace />
            );
            break;
        case auth?.role?.name === 'Admin':
            componentToRender = (
                <Navigate to="/" state={{ from: location }} replace />
            );
            break;
        case auth?.role?.name === 'Key Account Maneger':
            componentToRender = (
                <Navigate to="/key/dashboard" state={{ from: location }} replace />
            );
            break;
        case auth?.role?.name === 'Seller':
            componentToRender = (
                <Navigate to="/seller/seller-dashboard" state={{ from: location }} replace />
            );
            break;
        default:
            componentToRender = <Navigate to="*" state={{ from: location }} replace />;

    }

    return componentToRender;
};

export default RequireAuth;
