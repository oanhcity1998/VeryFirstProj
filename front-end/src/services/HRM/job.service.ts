import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  JobResponse,
  JobCreateRequest,
  JobCreateResponse,
  JobUpdateRequest,
  JobUpdateResponse,
  JobDeleteResponse,
} from "@/models/HRM/job.model";

const tags = {
  jobs: "Jobs",
};

export const jobService = createApi({
  reducerPath: "jobService",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/hr`,
    credentials: "include",
  }),
  tagTypes: [tags.jobs],
  endpoints: (builder) => ({
    getJobs: builder.query<
      JobResponse,
      { q?: string; page?: number; limit?: number }
    >({
      query: ({ q, page, limit }) => ({
        url: "jobs",
        params: { q, page: page ?? 1, limit: limit ?? 10 },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: tags.jobs, id: "LIST" },
              ...result.data.map((job) => ({ type: tags.jobs, id: job.id })),
            ]
          : [{ type: tags.jobs, id: "LIST" }],
    }),
    createJob: builder.mutation<JobCreateResponse, JobCreateRequest>({
      query: (job) => ({
        url: "jobs",
        method: "POST",
        body: job,
      }),
      invalidatesTags: [{ type: tags.jobs, id: "LIST" }],
    }),
    updateJob: builder.mutation<
      JobUpdateResponse,
      { id: number; data: JobUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `jobs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: tags.jobs, id }],
    }),
    deleteJob: builder.mutation<JobDeleteResponse, number>({
      query: (id) => ({
        url: `jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: tags.jobs, id },
        { type: tags.jobs, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobService;
