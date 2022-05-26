import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const PrivateRoute = () => {
    const { user } = React.useContext(AuthContext);
    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute;