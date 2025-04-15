const express = require('express');
const router = express.Router();
const {
  getIngredients,
  getIngredient,
  createIngredient,
  updateIngredient,
  deleteIngredient
} = require('../controllers/ingredient.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router
  .route('/')
  .get(getIngredients)
  .post(protect, authorize('admin'), upload.single('image'), createIngredient);

router
  .route('/:id')
  .get(getIngredient)
  .put(protect, authorize('admin'), upload.single('image'), updateIngredient)
  .delete(protect, authorize('admin'), deleteIngredient);

module.exports = router; 