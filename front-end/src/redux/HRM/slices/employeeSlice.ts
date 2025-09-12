import { EmployeeState } from "@/models/HRM/employee.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    setEmployees: (state, action: PayloadAction<EmployeeState>) => {
      state.employees = action.payload.employees;
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
