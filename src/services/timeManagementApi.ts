import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const timeManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimeManagement: builder.query<ICommonParameterDto[], void>({
      query: () => ({
        url: `/CommonParameters/time-management`,
        method: 'GET',
      }),
      keepUnusedDataFor: 60 * 60, // 1 hour
      providesTags: ['TimeManagement'], 
    }),
  }),
});

export const { useGetTimeManagementQuery } = timeManagementApi;