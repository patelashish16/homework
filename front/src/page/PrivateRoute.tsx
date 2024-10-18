import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MyContext } from '../context/index';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { session }: any = useContext(MyContext);
    return session?.token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
