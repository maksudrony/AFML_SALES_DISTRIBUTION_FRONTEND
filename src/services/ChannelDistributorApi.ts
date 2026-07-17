import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export interface IChannelDistributorParams {
  channelId: number | null;
  userId: string;
}

export const channelDistributorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannelDistributor: builder.query<ICommonParameterDto[], IChannelDistributorParams>({
      query: (params) => ({
        url: '/CommonParameters/channel-wise-distributor',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0, //no cache for query
    }),
  }),
});

export const { useGetChannelDistributorQuery } = channelDistributorApi;
