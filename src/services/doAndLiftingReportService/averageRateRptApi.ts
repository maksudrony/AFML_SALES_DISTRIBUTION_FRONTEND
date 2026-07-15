import { baseApi } from '.././api';

export interface IAverageRateRptParams {
  fromDate: string;
  toDate: string;
  dayFromDate: string;
  dayToDate: string;
  channelId: number | null;
  channelTypeId: number | null;
  typeId: number;
  reportTypeId: number;
  entryBy: string;
}

export interface IAverageRateRptHeader {
  reportType: string;
  monthlyDateRange: string;
  dailyDateRange: string;
}

export interface IAverageRateRptRow {
  channelType: number;
  channelId: number;
  channelName: string;
  productId: number;
  productName: string;

  monQty: number;
  monValue: number;
  monAvgRate: number;

  dayQty: number;
  dayValue: number;
  dayAvgRate: number;
}

export interface IAverageRateRptResponse {
  reportHeader: IAverageRateRptHeader;
  reportRows: IAverageRateRptRow[];
}

export const averageRateRptApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAverageRateRpt: builder.query<IAverageRateRptResponse, IAverageRateRptParams>({
      query: (params) => ({
        url: '/AverageRateRpt/avg-rate-rpt',
        method: 'GET',
        params, 
      }),
    }),
  }),
});

export const { useLazyGetAverageRateRptQuery } = averageRateRptApi;