import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export interface IZoneParams {
  userId: string;
  channelId: number;
}

export const zoneParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getZones: builder.query<ICommonParameterDto[], IZoneParams>({
      query: (params) => ({
        url: '/CommonParameters/zones',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 60 * 60, //1 Hour
      providesTags: ['Zones'],
    }),
  }),
});

export const { useGetZonesQuery } = zoneParameterApi;