import api from './api';
import { INGREDIENT_ENDPOINTS } from '../config/api';

// Helper function to validate and transform ingredient data
const transformIngredientData = (data) => {
  if (!data) {
    console.warn('No data provided to transformIngredientData');
    return null;
  }
  
  console.log('Transforming ingredient data:', data);
  
  // Extract data from nested structure if it exists
  const ingredientData = data.data || data.ingredient || data;
  
  const transformed = {
    _id: ingredientData._id || '',
    name: ingredientData.name || '',
    description: ingredientData.description || '',
    price: parseFloat(ingredientData.price) || 0,
    stock: parseInt(ingredientData.stock) || 0,
    category: ingredientData.category || 'Uncategorized',
    image: ingredientData.image || '',
    createdAt: ingredientData.createdAt || new Date().toISOString(),
    updatedAt: ingredientData.updatedAt || new Date().toISOString()
  };
  
  console.log('Transformed ingredient data:', transformed);
  return transformed;
};

// Get all ingredients
export const getAllIngredients = async (filters = {}) => {
  try {
    const { category, search } = filters;
    let url = INGREDIENT_ENDPOINTS.GET_ALL;
    
    // Add query parameters if filters are provided
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log('Fetching ingredients from:', url);
    const response = await api.get(url);
    console.log('Raw API Response:', response.data);
    
    // Check if the response has the expected structure
    let ingredients = [];
    if (response.data && Array.isArray(response.data)) {
      ingredients = response.data;
    } else if (response.data && response.data.ingredients) {
      ingredients = response.data.ingredients;
    } else if (response.data && response.data.data) {
      ingredients = response.data.data;
    }
    
    // Transform each ingredient
    return ingredients.map(transformIngredientData);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { success: false, message: 'Failed to fetch ingredients' };
  }
};

// Get a single ingredient by ID
export const getIngredientById = async (id) => {
  if (!id) {
    throw new Error('Ingredient ID is required');
  }
  try {
    console.log('Fetching ingredient with ID:', id);
    const response = await api.get(INGREDIENT_ENDPOINTS.GET_ONE(id));
    console.log('Raw ingredient response:', response.data);
    
    // Check if we have the expected data structure
    if (!response.data) {
      throw new Error('No data received from the server');
    }
    
    const transformedData = transformIngredientData(response.data);
    console.log('Final transformed ingredient data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    if (error.response?.status === 404) {
      throw new Error(`Ingredient with ID ${id} not found`);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch ingredient');
  }
};

// Create a new ingredient
export const createIngredient = async (ingredientData) => {
  try {
    const response = await api.post(INGREDIENT_ENDPOINTS.CREATE, ingredientData);
    return transformIngredientData(response.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create ingredient');
  }
};

// Update an ingredient
export const updateIngredient = async (id, ingredientData) => {
  if (!id) {
    throw new Error('Ingredient ID is required');
  }
  try {
    const response = await api.put(INGREDIENT_ENDPOINTS.UPDATE(id), ingredientData);
    return transformIngredientData(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Ingredient with ID ${id} not found`);
    }
    throw new Error(error.response?.data?.message || 'Failed to update ingredient');
  }
};

// Delete an ingredient
export const deleteIngredient = async (id) => {
  if (!id) {
    throw new Error('Ingredient ID is required');
  }
  try {
    const response = await api.delete(INGREDIENT_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Ingredient with ID ${id} not found`);
    }
    throw new Error(error.response?.data?.message || 'Failed to delete ingredient');
  }
};

const ingredientService = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
};

export default ingredientService; 