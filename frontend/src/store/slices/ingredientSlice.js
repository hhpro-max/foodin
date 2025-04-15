import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
} from '../../services/ingredientService';

// Async thunks
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getAllIngredients(filters);
      console.log('Fetch ingredients response:', response);
      // Ensure we're returning an array
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Fetch ingredients error:', error);
      return rejectWithValue(error.message || 'Failed to fetch ingredients');
    }
  }
);

export const fetchIngredientById = createAsyncThunk(
  'ingredients/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      return await getIngredientById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addIngredient = createAsyncThunk(
  'ingredients/add',
  async (ingredientData, { rejectWithValue }) => {
    try {
      return await createIngredient(ingredientData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editIngredient = createAsyncThunk(
  'ingredients/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateIngredient(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeIngredient = createAsyncThunk(
  'ingredients/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteIngredient(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [],
    selectedIngredient: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all ingredients
      .addCase(fetchIngredients.pending, (state) => {
        console.log('Fetch ingredients pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        console.log('Fetch ingredients fulfilled:', action.payload);
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        console.log('Fetch ingredients rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      // Fetch single ingredient
      .addCase(fetchIngredientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIngredient = action.payload;
      })
      .addCase(fetchIngredientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add ingredient
      .addCase(addIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit ingredient
      .addCase(editIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editIngredient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove ingredient
      .addCase(removeIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(removeIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSelectedIngredient } = ingredientSlice.actions;
export default ingredientSlice.reducer; 