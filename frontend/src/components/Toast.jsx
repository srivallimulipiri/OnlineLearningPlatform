import React, { useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from 'react-icons/fa';

const Toast = () => {
  const { notifications, removeNotification } = useNotification();

  const getToastStyles = (type) => {
    const baseStyles = "flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg transform transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 text-green-800 border border-green-200`;
      case 'error':
        return `${baseStyles} bg-red-50 text-red-800 border border-red-200`;
      case 'warning':
        return `${baseStyles} bg-accent-light text-accent-dark border border-accent`;
      case 'info':
      default:
        return `${baseStyles} bg-primary-light text-primary-dark border border-primary`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500 text-lg" />;
      case 'error':
        return <FaTimesCircle className="text-red-500 text-lg" />;
      case 'warning':
        return <FaExclamationTriangle className="text-accent text-lg" />;
      case 'info':
      default:
        return <FaInfoCircle className="text-primary text-lg" />;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={getToastStyles(notification.type)}
          role="alert"
        >
          <div className="flex items-center">
            {getIcon(notification.type)}
            <div className="ml-3 text-sm font-medium flex-1">
              {notification.message}
            </div>
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-neutral-300 p-1.5 hover:bg-neutral-100 inline-flex h-8 w-8 items-center justify-center"
              onClick={() => removeNotification(notification.id)}
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
