import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const productParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductDetails: builder.query<ICommonParameterDto[], void>({
      query: () => '/CommonParameters/product-detail',
      providesTags: ['ProductDetail'],
    }),
  }),
});

export const { useGetProductDetailsQuery } = productParameterApi;