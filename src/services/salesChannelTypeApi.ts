import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const salesChannelTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesChannelType: builder.query<ICommonParameterDto[], string>({
      query: (userId) => ({
        url: `/CommonParameters/sales-channel-type`,
        method: 'GET',
        params: { userId },
      }),
      providesTags: ['SalesChannelType'], 
    }),
  }),
});

export const { useGetSalesChannelTypeQuery } = salesChannelTypeApi;