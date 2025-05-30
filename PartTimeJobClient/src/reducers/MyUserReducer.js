
import cookie from 'react-cookies';

const MyUserReducer = (current, action) => {
    switch (action.type) {
        case "login":
            return action.payload
        case 'update_user':
            return action.payload;
        case "logout":
            cookie.remove('token', { path: '/' });
            cookie.remove("user", { path: '/' });
            return null;
    }

    return current;
}

export default MyUserReducer;