import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MyUserContext } from '../../configs/Contexts';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const user  = useContext(MyUserContext);

    if (!user || !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;