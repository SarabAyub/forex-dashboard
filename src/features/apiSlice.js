import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://212.117.171.68:5000',
    prepareHeaders: (headers) => {
      headers.set('accept', 'text/plain'); 
      return headers;
    },
    responseHandler: (response) => response.text(), 
  }),
  endpoints: (builder) => ({
    connect: builder.query({
      query: ({ user, password, host, port }) =>
        `/Connect?user=${user}&password=${password}&host=${host}&port=${port}`,
    }),
    subscribe: builder.query({
      query: ({ id, symbol }) => `/Subscribe?id=${id}&symbol=${symbol}`,
    }),
  }),

});

export const { useLazyConnectQuery, useLazySubscribeQuery } = apiSlice;
