import { useContext } from 'react';
import { useNotification as useNotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  const { addNotification, removeNotification, clearAll, notifications } = useNotificationContext();

  const showNotification = (message, type = 'info', duration = 5000) => {
    return addNotification(message, type, duration);
  };

  const showSuccess = (message, duration = 5000) => {
    return addNotification(message, 'success', duration);
  };

  const showError = (message, duration = 7000) => {
    return addNotification(message, 'error', duration);
  };

  const showWarning = (message, duration = 6000) => {
    return addNotification(message, 'warning', duration);
  };

  const showInfo = (message, duration = 5000) => {
    return addNotification(message, 'info', duration);
  };

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll
  };
};

export default useNotification;
