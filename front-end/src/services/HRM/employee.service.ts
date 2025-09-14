import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  EmployeeCreateResponse,
  EmployeeDetailResponse,
  EmployeeQueryParams,
  EmployeeRequest,
  EmployeeResponse,
  EmployeeUpdateResponse,
} from "@/models/HRM/employee.model";

const tags = {
  employees: "Employees",
};

const handleError = (response: { status: number; data: any }) => ({
  error: response.data?.error || `Lỗi server (status: ${response.status})`,
});

export const employeeService = createApi({
  reducerPath: "employeeService",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/hr`,
    credentials: "include",
  }),
  tagTypes: [tags.employees],
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeResponse, EmployeeQueryParams>({
      query: (params) => ({
        url: "/employees",
        params: {
          q: params.q,
          department_id: params.department_id,
          job_id: params.job_id,
          status: params.status,
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: tags.employees, id: "LIST" },
              ...result.data.map((employee) => ({
                type: tags.employees,
                id: employee.id,
              })),
            ]
          : [{ type: tags.employees, id: "LIST" }],
    }),
    createEmployee: builder.mutation<EmployeeCreateResponse, EmployeeRequest>({
      query: (employee) => ({
        url: "employees",
        method: "POST",
        body: {
          ...employee,
          contract: employee.contract || [],
        },
      }),
      transformResponse: (response: EmployeeCreateResponse) => response,
      transformErrorResponse: handleError,
      invalidatesTags: [{ type: tags.employees, id: "LIST" }],
    }),
    getEmployeeById: builder.query<EmployeeDetailResponse, number>({
      query: (id) => `employees/${id}`,
      transformResponse: (response: { data: EmployeeDetailResponse }) =>
        response.data,
      transformErrorResponse: handleError,
      providesTags: (result, error, id) =>
        result
          ? [{ type: tags.employees, id }]
          : [{ type: tags.employees, id }],
    }),
    updateEmployee: builder.mutation<
      EmployeeUpdateResponse,
      { id: number; data: EmployeeRequest }
    >({
      query: ({ id, data }) => ({
        url: `employees/${id}`,
        method: "PUT",
        body: {
          ...data,
          contract: data.contract || [],
        },
      }),
      transformResponse: (response: EmployeeUpdateResponse) => response,
      transformErrorResponse: handleError,
      invalidatesTags: (result, error, { id }) => [
        { type: tags.employees, id },
        { type: tags.employees, id: "LIST" },
      ],
    }),
    deleteEmployee: builder.mutation<{ message?: string }, number>({
      query: (id) => ({
        url: `employees/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { message?: string }) => response,
      transformErrorResponse: handleError,
      invalidatesTags: (result, error, id) => [
        { type: tags.employees, id },
        { type: tags.employees, id: "LIST" },
      ],
    }),
    exportTemplate: builder.mutation<Blob, void>({
      query: () => ({
        url: "employees/export-template",
        method: "GET",
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const blob = await response.blob();
          if (blob.size === 0) {
            throw new Error("File Excel trả về rỗng");
          }
          return blob;
        },
      }),
      transformResponse: (response: Blob) => response,
      transformErrorResponse: handleError,
    }),
    importEmployees: builder.mutation<
      { message?: string; errors?: string[] },
      FormData
    >({
      query: (formData) => ({
        url: "employees/import",
        method: "POST",
        body: formData,
      }),
      transformErrorResponse: handleError,
      invalidatesTags: [{ type: tags.employees, id: "LIST" }],
    }),
    exportEmployees: builder.mutation<Blob, EmployeeQueryParams>({
      query: (params) => ({
        url: "employees/export",
        method: "GET",
        params: {
          q: params.q,
          department_id: params.department_id,
          job_id: params.job_id,
          status: params.status,
          page: params.page ?? 1,
          limit: params.limit ?? 100,
        },
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const blob = await response.blob();
          if (blob.size === 0) {
            throw new Error("File Excel trả về rỗng");
          }
          return blob;
        },
      }),
      transformResponse: (response: Blob) => response,
      transformErrorResponse: handleError,
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useExportTemplateMutation,
  useImportEmployeesMutation,
  useExportEmployeesMutation,
} = employeeService;
