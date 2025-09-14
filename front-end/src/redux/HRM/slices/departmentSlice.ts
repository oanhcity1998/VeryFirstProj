import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DepartmentResponse, Department } from "@/models/HRM/department.model";

interface DepartmentState {
  departments: Department[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  meta: null,
  error: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setDepartments: (state, action: PayloadAction<DepartmentResponse>) => {
      state.departments = action.payload.data || [];
      state.meta = action.payload.meta || null;
      state.error = null;
    },
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments = [...state.departments, action.payload];
      if (state.meta) {
        state.meta.total += 1;
        state.meta.pages = Math.ceil(state.meta.total / state.meta.limit);
      }
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      state.departments = state.departments.map((dept) =>
        dept.id === action.payload.id ? action.payload : dept
      );
    },
    deleteDepartments: (state, action: PayloadAction<number[]>) => {
      state.departments = state.departments.filter(
        (dept) => !action.payload.includes(dept.id)
      );
      if (state.meta) {
        state.meta.total -= action.payload.length;
        state.meta.pages = Math.ceil(state.meta.total / state.meta.limit);
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartments,
  setError,
  clearError,
} = departmentSlice.actions;
export default departmentSlice.reducer;
