import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const quantityTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuantityType: builder.query<ICommonParameterDto[], void>({
      query: () => ({
        url: `/CommonParameters/quantity-type`,
        method: 'GET',
      }),
      providesTags: ['QuantityType'], 
    }),
  }),
});

export const { useGetQuantityTypeQuery } = quantityTypeApi;