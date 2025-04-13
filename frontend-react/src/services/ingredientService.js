import axios from 'axios';
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
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch ingredients' };
  }
};

// Get a single ingredient by ID
export const getIngredientById = async (id) => {
  try {
    const response = await axios.get(INGREDIENT_ENDPOINTS.GET_ONE(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch ingredient' };
  }
};

// Create a new ingredient
export const createIngredient = async (ingredientData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append all ingredient data to FormData
    Object.keys(ingredientData).forEach(key => {
      if (key === 'image' && ingredientData[key] instanceof File) {
        formData.append('image', ingredientData[key]);
      } else {
        formData.append(key, ingredientData[key]);
      }
    });
    
    const response = await axios.post(INGREDIENT_ENDPOINTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create ingredient' };
  }
};

// Update an ingredient
export const updateIngredient = async (id, ingredientData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append all ingredient data to FormData
    Object.keys(ingredientData).forEach(key => {
      if (key === 'image' && ingredientData[key] instanceof File) {
        formData.append('image', ingredientData[key]);
      } else {
        formData.append(key, ingredientData[key]);
      }
    });
    
    const response = await axios.put(INGREDIENT_ENDPOINTS.UPDATE(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update ingredient' };
  }
};

// Delete an ingredient
export const deleteIngredient = async (id) => {
  try {
    const response = await axios.delete(INGREDIENT_ENDPOINTS.DELETE(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete ingredient' };
  }
}; 