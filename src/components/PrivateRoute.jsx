import React from 'react';
import { AuthContext } from '../context/auth';
import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoute = () => {
    const { user } = React.useContext(AuthContext);
    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute;