import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getUserOrders();
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch orders' });
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch order' });
    }
  }
);

export const createNewOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create order' });
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await orderService.updateOrderStatus(id, status);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update order' });
    }
  }
);

export const cancelOrderById = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      return await orderService.cancelOrder(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to cancel order' });
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    selectedOrder: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Map backend fields to frontend expected fields
        state.items = (action.payload.data || action.payload).map(order => ({
          id: order._id,
          customerName: order.user?.name || '-',
          createdAt: order.createdAt,
          total: order.totalAmount,
          status: order.status,
          // Add any other fields needed for details page
          ...order
        }));
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single order
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        // Map backend fields to frontend expected fields
        const order = action.payload;
        state.selectedOrder = order ? {
          id: order._id,
          customerName: order.user?.name || '-',
          createdAt: order.createdAt,
          total: order.totalAmount,
          status: order.status,
          ...order
        } : null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add order
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update order status
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Map backend fields to frontend expected fields
        const updatedOrder = {
          id: action.payload.data?._id || action.payload._id,
          customerName: action.payload.data?.user?.name || action.payload.user?.name || '-',
          createdAt: action.payload.data?.createdAt || action.payload.createdAt,
          total: action.payload.data?.totalAmount || action.payload.totalAmount,
          status: action.payload.data?.status || action.payload.status,
          ...((action.payload.data) ? action.payload.data : action.payload)
        };
        const index = state.items.findIndex(item => item.id === updatedOrder.id);
        if (index !== -1) {
          state.items[index] = updatedOrder;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel order
      .addCase(cancelOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(cancelOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer; 