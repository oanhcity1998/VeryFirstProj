import {
  Employee,
  EmployeeCreateRequest,
  EmployeeQueryParams,
  EmployeeResponse,
} from "@/models/HRM/employee.model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employeeService = createApi({
  reducerPath: "employeeService",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/hr`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeResponse, EmployeeQueryParams>({
      query: (params) => ({
        url: "/employees",
        params: {
          q: params.q,
          department_id: params.department_id,
          job_id: params.job_id,
          status: params.status,
          page: params.page,
          limit: params.limit,
        },
      }),
    }),
    createEmployee: builder.mutation<EmployeeResponse, EmployeeCreateRequest>({
      query: (employee) => ({
        url: "employees",
        method: "POST",
        body: employee,
      }),
      transformResponse: (response: EmployeeResponse) => response,
      transformErrorResponse: (response: {
        status: number;
        data: { error: string };
      }) => ({ error: response.data.error } as EmployeeResponse),
    }),
    getEmployeeById: builder.query<EmployeeResponse, number>({
      query: (id) => `employees/${id}`,
      transformResponse: (response: { data: Employee }) =>
        ({ data: [response.data] } as EmployeeResponse),
      transformErrorResponse: (response: {
        status: number;
        data: { error: string };
      }) => ({ error: response.data.error } as EmployeeResponse),
    }),
  }),
});

export const { useGetEmployeesQuery } = employeeService;
