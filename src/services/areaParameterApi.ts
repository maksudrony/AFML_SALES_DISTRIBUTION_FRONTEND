import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const areaParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAreas: builder.query<ICommonParameterDto[], { userId: string; divisionId: number }>({
      query: ({ userId, divisionId }) => ({
        url: `/CommonParameters/areas/${userId}/${divisionId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Areas'],
    }),
  }),
});

export const { useGetAreasQuery } = areaParameterApi;