import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export interface IChannelParams {
  userId: string;
}

export const channelParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<ICommonParameterDto[], IChannelParams>({
      query: (params) => ({
        url: '/CommonParameters/channels',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Channels'],
    }),
  }),
});

export const { useGetChannelsQuery } = channelParameterApi;