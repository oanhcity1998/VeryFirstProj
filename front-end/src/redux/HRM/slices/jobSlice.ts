import { JobNameResponse } from "@/models/HRM/job.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobState {
  jobs: { id: number; name: string }[];
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  error: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<JobNameResponse>) => {
      state.jobs = action.payload.data || [];
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

export const { setJobs, setError, clearError } = jobSlice.actions;
export default jobSlice.reducer;
