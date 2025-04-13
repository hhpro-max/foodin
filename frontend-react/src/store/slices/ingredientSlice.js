import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ingredientsApi } from '../../services/mockApi';

// Async thunks
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await ingredientsApi.getAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchIngredientById = createAsyncThunk(
  'ingredients/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await ingredientsApi.getById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createIngredient = createAsyncThunk(
  'ingredients/create',
  async (data, { rejectWithValue }) => {
    try {
      return await ingredientsApi.create(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateIngredient = createAsyncThunk(
  'ingredients/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await ingredientsApi.update(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteIngredient = createAsyncThunk(
  'ingredients/delete',
  async (id, { rejectWithValue }) => {
    try {
      await ingredientsApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  currentIngredient: null,
  loading: false,
  error: null,
};

// Slice
const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearCurrentIngredient: (state) => {
      state.currentIngredient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all ingredients
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch ingredient by ID
      .addCase(fetchIngredientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIngredient = action.payload;
      })
      .addCase(fetchIngredientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create ingredient
      .addCase(createIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update ingredient
      .addCase(updateIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIngredient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentIngredient?.id === action.payload.id) {
          state.currentIngredient = action.payload;
        }
      })
      .addCase(updateIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete ingredient
      .addCase(deleteIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentIngredient?.id === action.payload) {
          state.currentIngredient = null;
        }
      })
      .addCase(deleteIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentIngredient, clearError } = ingredientSlice.actions;
export default ingredientSlice.reducer; 