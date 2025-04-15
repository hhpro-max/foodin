import api from './api';
import { INGREDIENT_ENDPOINTS } from '../config/api';

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
    console.log('Raw API Response:', response);
    
    // Check if the response has the expected structure
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.ingredients) {
      return response.data.ingredients;
    } else if (response.data && response.data.data) {
      return response.data.data;
    } else {
      console.error('Unexpected API response structure:', response.data);
      return [];
    }
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
    const response = await api.get(INGREDIENT_ENDPOINTS.GET_ONE(id));
    return response.data;
  } catch (error) {
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
    return response.data;
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
    return response.data;
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