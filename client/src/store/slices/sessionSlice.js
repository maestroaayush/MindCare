import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sessionsAPI } from '../../utils/api';

// Async thunks for session operations
export const fetchSessions = createAsyncThunk(
  'sessions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sessionsAPI.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch sessions');
    }
  }
);

export const fetchUpcomingSessions = createAsyncThunk(
  'sessions/fetchUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sessionsAPI.getUpcoming();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch upcoming sessions');
    }
  }
);

export const createSession = createAsyncThunk(
  'sessions/create',
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await sessionsAPI.create(sessionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create session');
    }
  }
);

export const updateSession = createAsyncThunk(
  'sessions/update',
  async ({ id, sessionData }, { rejectWithValue }) => {
    try {
      const response = await sessionsAPI.update(id, sessionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update session');
    }
  }
);

export const deleteSession = createAsyncThunk(
  'sessions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await sessionsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete session');
    }
  }
);

export const fetchPsychiatrists = createAsyncThunk(
  'sessions/fetchPsychiatrists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sessionsAPI.getPsychiatrists();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch psychiatrists');
    }
  }
);

// Initial state
const initialState = {
  sessions: [],
  upcomingSessions: [],
  psychiatrists: [],
  isLoading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

// Session slice
const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all sessions
      .addCase(fetchSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
        state.error = null;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch upcoming sessions
      .addCase(fetchUpcomingSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingSessions = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create session
      .addCase(createSession.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.createLoading = false;
        state.sessions.push(action.payload);
        state.error = null;
      })
      .addCase(createSession.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update session
      .addCase(updateSession.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.sessions.findIndex(session => session.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete session
      .addCase(deleteSession.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.sessions = state.sessions.filter(session => session.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      // Fetch psychiatrists
      .addCase(fetchPsychiatrists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPsychiatrists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.psychiatrists = action.payload;
        state.error = null;
      })
      .addCase(fetchPsychiatrists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilter } = sessionSlice.actions;

// Selectors
export const selectSessions = (state) => state.sessions.sessions;
export const selectUpcomingSessions = (state) => state.sessions.upcomingSessions;
export const selectPsychiatrists = (state) => state.sessions.psychiatrists;
export const selectSessionsLoading = (state) => state.sessions.isLoading;
export const selectSessionsError = (state) => state.sessions.error;
export const selectCreateLoading = (state) => state.sessions.createLoading;
export const selectUpdateLoading = (state) => state.sessions.updateLoading;
export const selectDeleteLoading = (state) => state.sessions.deleteLoading;

export default sessionSlice.reducer;
