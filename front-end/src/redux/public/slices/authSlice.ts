import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  uid: number | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  uid: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ uid: number }>) => {
      state.uid = action.payload.uid;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    logout: (state) => {
      state.uid = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { setCredentials, setError, setLoading, logout } =
  authSlice.actions;
export default authSlice.reducer;
