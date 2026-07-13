import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const productParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductDetails: builder.query<ICommonParameterDto[], void>({
      query: () => ({
        url: '/CommonParameters/product-detail',
        method: 'GET',
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['ProductDetail'],
    }),
  }),
});

export const { useGetProductDetailsQuery } = productParameterApi;