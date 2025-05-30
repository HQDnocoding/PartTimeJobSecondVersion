import { useState } from 'react';

const useValidatePassword = () => {
    const [error, setError] = useState('');

    const validate = (password) => {
        if (password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự.');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Mật khẩu phải chứa ít nhất một chữ hoa.');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            setError('Mật khẩu phải chứa ít nhất một chữ thường.');
            return false;
        }
        if (!/\d/.test(password)) {
            setError('Mật khẩu phải chứa ít nhất một số.');
            return false;
        }
        setError('');
        return true;
    };

    return { validate, error };
};

export default useValidatePassword;
