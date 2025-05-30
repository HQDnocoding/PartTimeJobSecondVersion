import { useState } from 'react';

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

