const Ingredient = require('../models/ingredient.model');

// Get all ingredients
exports.getIngredients = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Add category filter if provided
    if (category) {
      query.category = category.toLowerCase();
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const ingredients = await Ingredient.find(query);
    res.json({
      success: true,
      count: ingredients.length,
      data: ingredients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single ingredient
exports.getIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient not found'
      });
    }
    res.json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new ingredient
exports.createIngredient = async (req, res) => {
  try {
    // Store image as base64 string from req.body.image
    const ingredient = await Ingredient.create({
      ...req.body,
      image: req.body.image // base64 string
    });
    res.status(201).json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update ingredient
exports.updateIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient not found'
      });
    }

    // If new image is uploaded, update the image path
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: updatedIngredient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete ingredient
exports.deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient not found'
      });
    }

    await ingredient.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 