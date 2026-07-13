import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const divisionParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDivisions: builder.query<ICommonParameterDto[], { userId: string; zoneId: number }>({
      query: ({ userId, zoneId }) => ({
        url: `/CommonParameters/divisions/${userId}/${zoneId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Divisions'],
    }),
  }),
});

export const { useGetDivisionsQuery } = divisionParameterApi;