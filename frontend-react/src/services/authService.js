import axios from 'axios';
import { AUTH_ENDPOINTS } from '../config/api';

// Set auth token in axios headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.REGISTER, userData);
    if (response.data.success) {
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Registration failed' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.LOGIN, credentials);
    if (response.data.success) {
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    setAuthToken(token);
    const response = await axios.get(AUTH_ENDPOINTS.GET_ME);
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

// Logout user
export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Check if user is admin
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
}; 