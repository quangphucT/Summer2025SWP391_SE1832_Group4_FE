import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../redux/feature/userSlice';
import experienceWorkingSlice from '../redux/feature/experienceWorkingSlice';
import certificateSlice from '../redux/feature/certificateSlice';
import doctorSlice from '../redux/feature/doctorSlice';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import storageSession from 'redux-persist/lib/storage/session';
// ✅ Cấu hình redux-persist cho từng slice
const persistConfig = {
  key: 'root',
  storage: storageSession, 
  whitelist: ['user'], // ✅ Lưu cả user và balance
};

// ✅ Kết hợp reducers
const rootReducer = combineReducers({
  user: userSlice,
  experienceWorking: experienceWorkingSlice,
  certificates: certificateSlice,
  doctor: doctorSlice,
});

// ✅ Bọc rootReducer bằng persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Tắt cảnh báo serialize của redux-persist
    }),
});

// ✅ Khởi tạo persistor để quản lý state đã lưu
export const persistor = persistStore(store);
