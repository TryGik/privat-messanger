import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { LOGIN_ROUTE } from '../utils/consts';

const PrivateRoute = () => {
    const { user } = React.useContext(AuthContext);
    return user ? <Outlet /> : <Navigate to={LOGIN_ROUTE} />
}

export default PrivateRoute;