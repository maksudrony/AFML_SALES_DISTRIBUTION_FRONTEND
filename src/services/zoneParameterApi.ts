import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const zoneParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getZones: builder.query<ICommonParameterDto[], { userId: string; channelId: number }>({
      query: ({ userId, channelId }) => `/CommonParameters/zones/${userId}/${channelId}`,
      providesTags: ['Zones'],
    }),
  }),
});

export const { useGetZonesQuery } = zoneParameterApi;