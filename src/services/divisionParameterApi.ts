import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const divisionParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDivisions: builder.query<ICommonParameterDto[], { userId: string; zoneId: number }>({
      query: ({ userId, zoneId }) => `/CommonParameters/divisions/${userId}/${zoneId}`,
      providesTags: ['Divisions'],
    }),
  }),
});

export const { useGetDivisionsQuery } = divisionParameterApi;