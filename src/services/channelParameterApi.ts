import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const channelParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<ICommonParameterDto[], string>({
      query: (userId) => ({
        url: `/CommonParameters/channels/${userId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Channels'],
    }),
  }),
});

export const { useGetChannelsQuery } = channelParameterApi;