import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const quantityTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuantityType: builder.query<ICommonParameterDto[], void>({
      query: () => ({
        url: `/CommonParameters/quantity-type`,
        method: 'GET',
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['QuantityType'], 
    }),
  }),
});

export const { useGetQuantityTypeQuery } = quantityTypeApi;