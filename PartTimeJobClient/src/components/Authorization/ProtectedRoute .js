import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MyUserContext } from '../../configs/Contexts';
import cookie from 'react-cookies';


const ProtectedRoute = ({ allowedRoles, children }) => {
    const user = cookie.load('user') || null;

    if (!user || !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;