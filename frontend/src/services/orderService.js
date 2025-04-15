import api from './api';
import { ORDER_ENDPOINTS } from '../config/api';

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post(ORDER_ENDPOINTS.CREATE, orderData);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(ORDER_ENDPOINTS.GET_ONE(id));
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get(ORDER_ENDPOINTS.GET_USER_ORDERS);
    return response.data.data;
  },

  getAllOrders: async () => {
    const response = await api.get(ORDER_ENDPOINTS.GET_ALL);
    return response.data.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(ORDER_ENDPOINTS.UPDATE_STATUS(id), { status });
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.put(ORDER_ENDPOINTS.CANCEL(id));
    return response.data;
  }
};

export default orderService; 