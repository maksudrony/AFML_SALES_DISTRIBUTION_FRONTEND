import { baseApi } from '../api';

export interface ISalesDashboardParams {
  fromDate: string;
  toDate: string;
  typeId: number | null;
  entryBy: string;
}

export interface ISalesDashboardSummary {
  liftingQty: number;
  salesQty: number;
  imsQty: number;
  pendingQty: number;
}

export interface IChannelWiseLifting {
  channelId: number;
  channelName: string;
  liftingQty: number;
}

export interface IChannelWiseSales {
  channelId: number;
  channelName: string;
  salesQty: number;
}

export interface IMonthlyChannelWiseLifting  {
  dcMonName: string;
  channelId: number;
  channelName: string;
  liftingQty: number;
}

export interface IMonthlySalesVsLifting  {
  doMonName: string;
  salesQty: number;
  liftingQty: number;
}

export interface ISalesDashboardResponse {
  summary: ISalesDashboardSummary;
  channelWiseLifting: IChannelWiseLifting[];
  channelWiseSales: IChannelWiseSales[];
  monthlyChannelWiseLifting: IMonthlyChannelWiseLifting[];
  monthlySalesVsLifting: IMonthlySalesVsLifting [];
}

export const salesDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesDashboardSummary: builder.query<ISalesDashboardResponse,ISalesDashboardParams>({
      query: (params) => ({
        url: '/SalesDashboard/summary',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const { useGetSalesDashboardSummaryQuery, } = salesDashboardApi;