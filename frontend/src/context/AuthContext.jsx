import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null); // Renamed to avoid confusion
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuthData = localStorage.getItem('user'); // This is the full response object
    if (storedAuthData) {
      try {
        const parsedAuthData = JSON.parse(storedAuthData);
        // Set the user state to the actual user object from the stored data
        setUserState(parsedAuthData.user);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
    setLoading(false);
  }, []);

  // This function will be called by Login/Register with the full API response
  const login = (authData) => { // authData is { user: {...}, token: '...' }
    setUserState(authData.user); // Set user state to the user object
    localStorage.setItem('user', JSON.stringify(authData)); // Store full auth data
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user // Add isAuthenticated based on user presence
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
