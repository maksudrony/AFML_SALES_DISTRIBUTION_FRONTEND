import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const productCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductCategories: builder.query<ICommonParameterDto[], void>({
      query: () => '/CommonParameters/product-categories',
      providesTags: ['ProductCategory'],
    }),
  }),
});

export const { useGetProductCategoriesQuery } = productCategoryApi;