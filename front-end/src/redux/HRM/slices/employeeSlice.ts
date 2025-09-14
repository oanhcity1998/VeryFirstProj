// src/redux/HRM/slices/employeeSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee, EmployeeResponse } from "@/models/HRM/employee.model";

interface EmployeeState {
  employees: Employee[];
  meta: {
    page: number;
    limit: number;
    total: number;
  } | null;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  meta: null,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<EmployeeResponse>) => {
      state.employees = action.payload.data || [];
      state.meta = action.payload.meta || null;
      state.error = action.payload.error || null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setEmployees, setError, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
