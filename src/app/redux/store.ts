import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import authReducer from '../redux/slices/authSlice';  // Import your authSlice reducer

// Set up the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,  // Use the imported authReducer
  },
});

// Create typed hooks for dispatching and selecting state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
