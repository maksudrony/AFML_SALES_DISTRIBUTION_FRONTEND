import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export interface IChallanDistributorParams {
  fromDate: string;
  toDate: string;
  channelId: number | null;
  userId: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface IChallanDistributorResponse {
  items: ICommonParameterDto[];
  totalCount: number;
  hasMore: boolean;
}

export const challanDistributorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChallanDistributor: builder.query<IChallanDistributorResponse, IChallanDistributorParams>({
      query: (params) => ({
        url: '/ChallanWiseDistrib',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0, //no cache for query
    }),
  }),
});

export const { useLazyGetChallanDistributorQuery } = challanDistributorApi;