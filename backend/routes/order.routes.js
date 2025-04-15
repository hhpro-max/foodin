const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router
  .route('/:id')
  .get(protect, getOrder)
  .put(protect, authorize('admin'), updateOrderStatus)
  .delete(protect, cancelOrder);

module.exports = router; 