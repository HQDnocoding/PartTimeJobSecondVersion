import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MyUserContext } from '../configs/Contexts';

const useValidateUsername = () => {
    const [error, setError] = useState('');

    const validate = (username) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(username)) {
            setError('Tên đăng nhập phải là một địa chỉ email hợp lệ.');
            return false;
        }

        setError('');
        return true;
    };

    return { validate, error };
};

export default useValidateUsername;


export const useRoleGuard = (allowedRoles) => {
    const user = useContext(MyUserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !allowedRoles.includes(user.role)) {
            navigate('/', { replace: true });
        }
    }, [user, allowedRoles, navigate]);
};


