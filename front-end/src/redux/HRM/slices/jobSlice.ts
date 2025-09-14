import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobResponse, Job } from "@/models/HRM/job.model";

interface JobState {
  jobs: Job[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  meta: null,
  error: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<JobResponse>) => {
      state.jobs = action.payload.data || [];
      state.meta = action.payload.meta || null;
      state.error = null;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs = [...state.jobs, action.payload];
      if (state.meta) {
        state.meta.total += 1;
        state.meta.pages = Math.ceil(state.meta.total / state.meta.limit);
      }
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      state.jobs = state.jobs.map((job) =>
        job.id === action.payload.id ? action.payload : job
      );
    },
    deleteJobs: (state, action: PayloadAction<number[]>) => {
      state.jobs = state.jobs.filter((job) => !action.payload.includes(job.id));
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

export const { setJobs, addJob, updateJob, deleteJobs, setError, clearError } =
  jobSlice.actions;
export default jobSlice.reducer;
