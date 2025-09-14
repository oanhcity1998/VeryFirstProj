import { JobNameResponse } from "@/models/HRM/job.model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobService = createApi({
  reducerPath: "jobService",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/hr`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getJobs: builder.query<JobNameResponse, void>({
      query: () => "jobs/ids",
    }),
  }),
});

export const { useGetJobsQuery } = jobService;
