import { DepartmentNameResponse } from "@/models/HRM/department.model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const departmentService = createApi({
  reducerPath: "departmentService",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/hr`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getDepartments: builder.query<DepartmentNameResponse, void>({
      query: () => "departments/ids",
    }),
  }),
});

export const { useGetDepartmentsQuery } = departmentService;
