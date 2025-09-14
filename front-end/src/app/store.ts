import { authService } from "@/services/public/auth.service";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { employeeService } from "@/services/HRM/employee.service";
import { departmentService } from "@/services/HRM/department.service";
import { jobService } from "@/services/HRM/position.service";

// Root reducer (chỉ còn slice thật sự cần và service)
const rootReducer = combineReducers({
  [authService.reducerPath]: authService.reducer,
  [employeeService.reducerPath]: employeeService.reducer,
  [departmentService.reducerPath]: departmentService.reducer,
  [jobService.reducerPath]: jobService.reducer,
});

// Persist config (chỉ cần auth)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
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
      .concat(employeeService.middleware)
      .concat(departmentService.middleware)
      .concat(jobService.middleware),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
