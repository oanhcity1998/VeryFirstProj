import {
  LoginRequest,
  LoginResponse,
  LoginResponseData,
} from "@/models/HRM/auth.model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseData, LoginRequest["params"]>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          jsonrpc: "2.0",
          method: "call",
          params: credentials,
        } as LoginRequest,
      }),
      transformResponse: (response: LoginResponse) => response.result.result,
    }),
  }),
});

export const { useLoginMutation } = authApi;
