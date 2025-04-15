// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GET_ME: `${API_BASE_URL}/auth/me`,
};

// Ingredient endpoints
export const INGREDIENT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/ingredients`,
  GET_ONE: (id) => `${API_BASE_URL}/ingredients/${id}`,
  CREATE: `${API_BASE_URL}/ingredients`,
  UPDATE: (id) => `${API_BASE_URL}/ingredients/${id}`,
  DELETE: (id) => `${API_BASE_URL}/ingredients/${id}`,
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/orders`,
  GET_USER_ORDERS: `${API_BASE_URL}/orders`,
  GET_ONE: (id) => `${API_BASE_URL}/orders/${id}`,
  CREATE: `${API_BASE_URL}/orders`,
  UPDATE_STATUS: (id) => `${API_BASE_URL}/orders/${id}/status`,
  CANCEL: (id) => `${API_BASE_URL}/orders/${id}/cancel`,
};

// Upload URL for images
export const UPLOAD_URL = `${API_BASE_URL.replace('/api', '')}/uploads`; 