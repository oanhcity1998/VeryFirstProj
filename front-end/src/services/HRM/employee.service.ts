import {
  EmployeeQueryParams,
  EmployeeResponse,
} from "@/models/HRM/employee.model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employeeService = createApi({
  reducerPath: "employeeService",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeResponse, EmployeeQueryParams>({
      query: (params) => ({
        url: "/hr/employees",
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
  }),
});

export const { useGetEmployeesQuery } = employeeService;
