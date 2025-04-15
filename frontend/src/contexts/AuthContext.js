import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          if (userData && userData.success) {
            setUser(userData.user);
          } else {
            authService.logout();
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message || 'Login failed');
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message || 'Registration failed');
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  // Check if user is admin
  const checkIsAdmin = () => {
    return authService.isAdmin();
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    isAuthenticated: !!user,
    isAdmin: checkIsAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 