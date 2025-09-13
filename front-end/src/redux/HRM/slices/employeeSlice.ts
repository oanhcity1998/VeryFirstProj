import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee, EmployeeResponse } from "@/models/HRM/employee.model";

export interface EmployeeState {
  employees: Employee[];
  meta: {
    page: number;
    limit: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  meta: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    // 👇 nhận đúng EmployeeResponse từ API
    setEmployees: (state, action: PayloadAction<EmployeeResponse>) => {
      state.employees = action.payload.data; // lấy từ "data"
      state.meta = action.payload.meta;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setEmployees, setError } = employeeSlice.actions;
export default employeeSlice.reducer;
