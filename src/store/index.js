import { configureStore, combineReducers } from '@reduxjs/toolkit';
import placesReducer from './places/placesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { placesMinimalTransform } from './persistTransform';
import { createLogger } from 'redux-logger';

// Combine all slice reducers here. If you add more slices in the future,
// include them in this object.
const rootReducer = combineReducers({
  places: placesReducer,
});

// Configuration for redux-persist. We persist the entire root state but
// apply a transform to limit what is actually saved for certain slices. The
// version property makes it easier to migrate storage in the future.
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  whitelist: ['places'],
  transforms: [placesMinimalTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Conditionally include redux-logger only in development. Logging every
// dispatched action is extremely helpful during development but can impact
// performance if enabled in production.
const loggerMiddleware = createLogger({ collapsed: true });

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(__DEV__ ? loggerMiddleware : []),
  devTools: __DEV__,
});

// Export the persistor to be used in the app entry to gate rendering until
// rehydration is complete.
export const persistor = persistStore(store);

export default store;
