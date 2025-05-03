import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

/**
 * Configure the Redux store with all reducers
 */
export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Date objects in the state since they're not serializable
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt'],
        ignoredPaths: ['todos.todos'],
      },
    }),
});

// Export types for TypeScript usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;