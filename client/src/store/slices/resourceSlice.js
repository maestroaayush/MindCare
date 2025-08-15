import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resourcesAPI } from '../../utils/api';

// Async thunks for resource operations
export const fetchResources = createAsyncThunk(
  'resources/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await resourcesAPI.getAll(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch resources');
    }
  }
);

export const fetchResourceById = createAsyncThunk(
  'resources/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await resourcesAPI.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch resource');
    }
  }
);

export const createResource = createAsyncThunk(
  'resources/create',
  async (resourceData, { rejectWithValue }) => {
    try {
      const response = await resourcesAPI.create(resourceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create resource');
    }
  }
);

export const updateResource = createAsyncThunk(
  'resources/update',
  async ({ id, resourceData }, { rejectWithValue }) => {
    try {
      const response = await resourcesAPI.update(id, resourceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update resource');
    }
  }
);

export const deleteResource = createAsyncThunk(
  'resources/delete',
  async (id, { rejectWithValue }) => {
    try {
      await resourcesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete resource');
    }
  }
);

export const likeResource = createAsyncThunk(
  'resources/like',
  async (id, { rejectWithValue }) => {
    try {
      const response = await resourcesAPI.like(id);
      return { id, likes: response.likes };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to like resource');
    }
  }
);

export const fetchResourceCategories = createAsyncThunk(
  'resources/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await resourcesAPI.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchResourceTypes = createAsyncThunk(
  'resources/fetchTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await resourcesAPI.getTypes();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch types');
    }
  }
);

// Initial state
const initialState = {
  resources: [],
  currentResource: null,
  categories: [],
  types: [],
  totalPages: 0,
  currentPage: 1,
  total: 0,
  filters: {
    type: '',
    category: '',
    difficulty: '',
    page: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  likeLoading: false,
};

// Resource slice
const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: '',
        category: '',
        difficulty: '',
        page: 1,
        limit: 10,
      };
    },
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
      state.currentPage = action.payload;
    },
    clearCurrentResource: (state) => {
      state.currentResource = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all resources
      .addCase(fetchResources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload.resources || action.payload;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.total = action.payload.total || state.resources.length;
        state.error = null;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch resource by ID
      .addCase(fetchResourceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResourceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResource = action.payload;
        state.error = null;
      })
      .addCase(fetchResourceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create resource
      .addCase(createResource.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.createLoading = false;
        state.resources.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createResource.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update resource
      .addCase(updateResource.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.resources.findIndex(resource => resource.id === action.payload.id);
        if (index !== -1) {
          state.resources[index] = action.payload;
        }
        if (state.currentResource && state.currentResource.id === action.payload.id) {
          state.currentResource = action.payload;
        }
        state.error = null;
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete resource
      .addCase(deleteResource.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.resources = state.resources.filter(resource => resource.id !== action.payload);
        state.total -= 1;
        if (state.currentResource && state.currentResource.id === action.payload) {
          state.currentResource = null;
        }
        state.error = null;
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      // Like resource
      .addCase(likeResource.pending, (state) => {
        state.likeLoading = true;
      })
      .addCase(likeResource.fulfilled, (state, action) => {
        state.likeLoading = false;
        const { id, likes } = action.payload;
        const index = state.resources.findIndex(resource => resource.id === id);
        if (index !== -1) {
          state.resources[index].likes = likes;
        }
        if (state.currentResource && state.currentResource.id === id) {
          state.currentResource.likes = likes;
        }
      })
      .addCase(likeResource.rejected, (state, action) => {
        state.likeLoading = false;
        state.error = action.payload;
      })
      // Fetch categories
      .addCase(fetchResourceCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch types
      .addCase(fetchResourceTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      });
  },
});

export const { 
  clearError, 
  setFilters, 
  clearFilters, 
  setCurrentPage, 
  clearCurrentResource 
} = resourceSlice.actions;

// Selectors
export const selectResources = (state) => state.resources.resources;
export const selectCurrentResource = (state) => state.resources.currentResource;
export const selectResourceCategories = (state) => state.resources.categories;
export const selectResourceTypes = (state) => state.resources.types;
export const selectResourceFilters = (state) => state.resources.filters;
export const selectResourcesLoading = (state) => state.resources.isLoading;
export const selectResourcesError = (state) => state.resources.error;
export const selectCreateLoading = (state) => state.resources.createLoading;
export const selectUpdateLoading = (state) => state.resources.updateLoading;
export const selectDeleteLoading = (state) => state.resources.deleteLoading;
export const selectLikeLoading = (state) => state.resources.likeLoading;
export const selectTotalPages = (state) => state.resources.totalPages;
export const selectCurrentPage = (state) => state.resources.currentPage;
export const selectTotal = (state) => state.resources.total;

export default resourceSlice.reducer;
