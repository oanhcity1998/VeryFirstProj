import {
  Employee,
  EmployeeCreateRequest,
  EmployeeQueryParams,
  EmployeeResponse,
} from "@/models/HRM/employee.model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define tags for caching and invalidation
const tags = {
  employees: "Employees",
};

export const employeeService = createApi({
  reducerPath: "employeeService",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/hr`,
    credentials: "include",
  }),
  tagTypes: [tags.employees], // Enable caching tags for invalidation
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeResponse, EmployeeQueryParams>({
      query: (params) => ({
        url: "/employees",
        params: {
          q: params.q,
          department_id: params.department_id,
          job_id: params.job_id,
          status: params.status,
          page: params.page ?? 1, // Default to 1 if undefined
          limit: params.limit ?? 10, // Default to 10 if undefined
        },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: tags.employees, id: "LIST" },
              ...result.data.map((employee: any) => ({
                type: tags.employees,
                id: employee.id,
              })),
            ]
          : [{ type: tags.employees, id: "LIST" }], // Provide tags for caching
    }),
    createEmployee: builder.mutation<EmployeeResponse, EmployeeCreateRequest>({
      query: (employee) => ({
        url: "employees",
        method: "POST",
        body: employee,
      }),
      // Transform response to ensure consistency
      transformResponse: (response: EmployeeResponse) => response,
      transformErrorResponse: (response: {
        status: number;
        data: { error: string };
      }) =>
        ({
          error: response.data.error,
        } as EmployeeResponse),
      // Invalidate cache on successful creation
      invalidatesTags: [{ type: tags.employees, id: "LIST" }],
    }),
    getEmployeeById: builder.query<EmployeeResponse, number>({
      query: (id) => `employees/${id}`,
      transformResponse: (response: { data: Employee }) =>
        ({
          data: [response.data],
        } as EmployeeResponse),
      transformErrorResponse: (response: {
        status: number;
        data: { error: string };
      }) =>
        ({
          error: response.data.error,
        } as EmployeeResponse),
      providesTags: (result, error, id) =>
        result
          ? [{ type: tags.employees, id }]
          : [{ type: tags.employees, id }],
    }),
    deleteEmployee: builder.mutation<{ message?: string }, number>({
      query: (id) => ({
        url: `employees/${id}`,
        method: "DELETE",
      }),
      // Transform response to handle success message or empty response
      transformResponse: (response: { message?: string }, meta, arg) =>
        response,
      transformErrorResponse: (response: {
        status: number;
        data: { error: string };
      }) => ({
        error: response.data.error,
      }),
      // Invalidate cache on successful deletion
      invalidatesTags: (result, error, id) => [{ type: tags.employees, id }],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useDeleteEmployeeMutation,
} = employeeService;
