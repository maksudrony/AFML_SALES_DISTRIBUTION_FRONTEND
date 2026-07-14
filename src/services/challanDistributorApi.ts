import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export interface IChallanDistributorParams {
  fromDate: string;
  toDate: string;
  channelId: number;
  userId: string;
}

export const challanDistributorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChallanDistributor: builder.query<ICommonParameterDto[], IChallanDistributorParams>({
      query: (params) => ({
        url: '/CommonParameters/challan-distributor',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0, //no cache for query
      providesTags: ['ChallanDistributor'],
    }),
  }),
});

export const { useGetChallanDistributorQuery } = challanDistributorApi;