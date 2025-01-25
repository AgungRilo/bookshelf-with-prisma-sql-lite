import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/authSlice';

// Persist config untuk auth state
const authPersistConfig = {
  key: 'auth',
  storage,
};

// Gunakan persistReducer pada authReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
  auth: persistedAuthReducer, // Gunakan reducer yang sudah dipersist
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
