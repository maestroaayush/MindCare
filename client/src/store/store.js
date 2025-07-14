import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sessionReducer from './slices/sessionSlice';
import resourceReducer from './slices/resourceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sessions: sessionReducer,
    resources: resourceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
