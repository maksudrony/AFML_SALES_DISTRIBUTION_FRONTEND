import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const channelParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<ICommonParameterDto[], string>({
      query: (userId) => `/CommonParameters/channels/${userId}`,
      providesTags: ['Channels'],
    }),
  }),
});

export const { useGetChannelsQuery } = channelParameterApi;