import axios from 'axios';
import { ORDER_ENDPOINTS } from '../config/api';

// Get all orders for the current user
export const getAllOrders = async () => {
  try {
    const response = await axios.get(ORDER_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch orders' };
  }
};

// Get a single order by ID
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(ORDER_ENDPOINTS.GET_ONE(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch order' };
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(ORDER_ENDPOINTS.CREATE, orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create order' };
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.put(ORDER_ENDPOINTS.UPDATE_STATUS(id), { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update order status' };
  }
};

// Cancel an order
export const cancelOrder = async (id) => {
  try {
    const response = await axios.delete(ORDER_ENDPOINTS.CANCEL(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to cancel order' };
  }
}; 