import { DepartmentNameResponse } from "@/models/HRM/department.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DepartmentState {
  departments: { id: number; name: string }[];
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  error: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setDepartments: (state, action: PayloadAction<DepartmentNameResponse>) => {
      state.departments = action.payload.data || [];
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setDepartments, setError, clearError } = departmentSlice.actions;
export default departmentSlice.reducer;
