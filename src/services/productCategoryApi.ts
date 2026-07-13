import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const productCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductCategories: builder.query<ICommonParameterDto[], void>({
      query: () => ({
        url: '/CommonParameters/product-categories',
        method: 'GET',
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['ProductCategory'],
    }),
  }),
});

export const { useGetProductCategoriesQuery } = productCategoryApi;