import { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext();
const NotificationDispatchContext = createContext();

const initialState = {
  refreshKey: 0, // Tăng để kích hoạt reload thông báo
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_NOTIFICATIONS':
      return { ...state, refreshKey: state.refreshKey + 1 };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={state}>
      <NotificationDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
export const useNotificationDispatch = () => useContext(NotificationDispatchContext);