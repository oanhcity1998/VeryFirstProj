import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authService = createApi({
  reducerPath: "authService",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { uid: number; message: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          jsonrpc: "2.0",
          method: "call",
          params: credentials,
        },
      }),
      transformResponse: (response: {
        jsonrpc: string;
        id: null;
        result: { result: { uid: number; message: string } };
      }) => response.result.result, // Extract nested result
    }),
  }),
});

export const { useLoginMutation } = authService;
