const Order = require('../models/order.model');
const Ingredient = require('../models/ingredient.model');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentStatus } = req.body;

    // Calculate total amount and validate stock
    let totalAmount = 0;
    for (const item of items) {
      const ingredient = await Ingredient.findById(item.ingredient);
      if (!ingredient) {
        return res.status(404).json({
          success: false,
          message: `Ingredient ${item.ingredient} not found`
        });
      }

      if (ingredient.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${ingredient.name}`
        });
      }

      totalAmount += ingredient.price * item.quantity;
      item.price = ingredient.price;

      // Update stock
      ingredient.stock -= item.quantity;
      await ingredient.save();
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'pay_in_place',
      paymentStatus: paymentStatus || 'pending'
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders (admin) or user's orders
exports.getOrders = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.ingredient', 'name price');

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.ingredient', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to cancel this order
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending orders'
      });
    }

    // Restore stock
    for (const item of order.items) {
      const ingredient = await Ingredient.findById(item.ingredient);
      ingredient.stock += item.quantity;
      await ingredient.save();
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 