import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export interface IChannelDistributorParams {
  channelId: number | null;
  userId: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface IChannelDistributorResponse {
  items: ICommonParameterDto[];
  totalCount: number;
  hasMore: boolean;
}

export const channelDistributorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannelDistributor: builder.query<IChannelDistributorResponse,IChannelDistributorParams>({
      query: (params) => ({
        url: '/ChannelWiseDistrib/channel-wise-distrib',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useLazyGetChannelDistributorQuery,
} = channelDistributorApi;