import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export interface IAreaParams {
  userId: string;
  divisionId: number;
}

export const areaParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAreas: builder.query<ICommonParameterDto[], IAreaParams>({
      query: (params) => ({
        url: '/CommonParameters/areas',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Areas'],
    }),
  }),
});

export const { useGetAreasQuery } = areaParameterApi;