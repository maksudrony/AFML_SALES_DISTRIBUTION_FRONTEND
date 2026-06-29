import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const areaParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAreas: builder.query<ICommonParameterDto[], { userId: string; divisionId: number }>({
      query: ({ userId, divisionId }) => `/CommonParameters/areas/${userId}/${divisionId}`,
      providesTags: ['Areas'],
    }),
  }),
});

export const { useGetAreasQuery } = areaParameterApi;