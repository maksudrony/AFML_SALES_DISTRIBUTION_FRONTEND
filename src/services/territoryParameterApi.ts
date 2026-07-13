import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export interface ITerritoryParams {
  userId: string;
  areaId: number;
}

export const territoryParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTerritories: builder.query<ICommonParameterDto[], ITerritoryParams>({
      query: (params) => ({
        url: '/CommonParameters/territories',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Territories'],
    }),
  }),
});

export const { useGetTerritoriesQuery } = territoryParameterApi;