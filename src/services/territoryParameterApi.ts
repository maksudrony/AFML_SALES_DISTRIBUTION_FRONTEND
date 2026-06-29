import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const territoryParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTerritories: builder.query<ICommonParameterDto[], { userId: string; areaId: number }>({
      query: ({ userId, areaId }) => `/CommonParameters/territories/${userId}/${areaId}`,
      providesTags: ['Territories'],
    }),
  }),
});

export const { useGetTerritoriesQuery } = territoryParameterApi;