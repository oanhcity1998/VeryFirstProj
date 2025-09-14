import {
  PositionCreateRequest,
  PositionCreateResponse,
  PositionDeleteResponse,
  PositionResponse,
  PositionUpdateRequest,
  PositionUpdateResponse,
} from "@/models/HRM/position.model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
      PositionResponse,
      { q?: string; page?: number; limit?: number } | void
    >({
      query: ({ q, page, limit } = {}) => ({
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

    createJob: builder.mutation<PositionCreateResponse, PositionCreateRequest>({
      query: (job) => ({
        url: "jobs",
        method: "POST",
        body: job,
      }),
      invalidatesTags: [{ type: tags.jobs, id: "LIST" }],
    }),
    updateJob: builder.mutation<
      PositionUpdateResponse,
      { id: number; data: PositionUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `jobs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: tags.jobs, id }],
    }),
    deleteJob: builder.mutation<PositionDeleteResponse, number>({
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
