import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  DepartmentResponse,
  DepartmentCreateRequest,
  DepartmentCreateResponse,
  DepartmentUpdateRequest,
  DepartmentUpdateResponse,
  DepartmentDeleteResponse,
} from "@/models/HRM/department.model";

const tags = {
  departments: "Departments",
};

export const departmentService = createApi({
  reducerPath: "departmentService",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/hr`,
    credentials: "include",
  }),
  tagTypes: [tags.departments],
  endpoints: (builder) => ({
    getDepartments: builder.query<
      DepartmentResponse,
      { q?: string; page?: number; limit?: number } | void
    >({
      query: ({ q, page, limit } = {}) => ({
        url: "departments",
        params: { q, page: page ?? 1, limit: limit ?? 5 },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: tags.departments, id: "LIST" },
              ...result.data.map((dept) => ({
                type: tags.departments,
                id: dept.id,
              })),
            ]
          : [{ type: tags.departments, id: "LIST" }],
    }),

    createDepartment: builder.mutation<
      DepartmentCreateResponse,
      DepartmentCreateRequest
    >({
      query: (dept) => ({
        url: "departments",
        method: "POST",
        body: dept,
      }),
      invalidatesTags: [{ type: tags.departments, id: "LIST" }],
    }),
    updateDepartment: builder.mutation<
      DepartmentUpdateResponse,
      { id: number; data: DepartmentUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `departments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tags.departments, id },
      ],
    }),
    deleteDepartment: builder.mutation<DepartmentDeleteResponse, number>({
      query: (id) => ({
        url: `departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: tags.departments, id },
        { type: tags.departments, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentService;
