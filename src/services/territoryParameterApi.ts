import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const territoryParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTerritories: builder.query<ICommonParameterDto[], { userId: string; areaId: number }>({
      query: ({ userId, areaId }) => ({
        url: `/CommonParameters/territories/${userId}/${areaId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Territories'],
    }),
  }),
});

export const { useGetTerritoriesQuery } = territoryParameterApi;