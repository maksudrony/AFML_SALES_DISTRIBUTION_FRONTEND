import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export interface IDivisionParams {
  userId: string;
  zoneId: number;
}

export const divisionParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDivisions: builder.query<ICommonParameterDto[], IDivisionParams>({
      query: (params) => ({
        url: '/CommonParameters/divisions',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Divisions'],
    }),
  }),
});

export const { useGetDivisionsQuery } = divisionParameterApi;