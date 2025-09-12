import { authService } from "@/services/public/auth.service";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/redux/public/slices/authSlice";
import employeeReducer from "@/redux/HRM/slices/employeeSlice";
import { employeeService } from "@/services/HRM/employee.service";

// Tạo rootReducer rỗng (chưa có slice nào)
const rootReducer = combineReducers({
  auth: authReducer,
  employee: employeeReducer,
  [authService.reducerPath]: authService.reducer,
  [employeeService.reducerPath]: employeeService.reducer,
});

// Cấu hình persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  // whitelist: ["auth"], // sau này có thể chỉ định slice cần lưu
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
      .concat(authService.middleware)
      .concat(employeeService.middleware),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
