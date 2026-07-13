import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const zoneParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getZones: builder.query<ICommonParameterDto[], { userId: string; channelId: number }>({
      query: ({ userId, channelId }) => ({
        url: `/CommonParameters/zones/${userId}/${channelId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Zones'],
    }),
  }),
});

export const { useGetZonesQuery } = zoneParameterApi;