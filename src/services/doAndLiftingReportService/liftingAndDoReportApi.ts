import { baseApi } from '.././api';

export interface ILiftingAndDoReportParams {
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

export interface ILiftingAndDoReportHeader {
  reportType: string;
  monthlyDateRange: string;
  dailyDateRange: string;
}

export interface ILiftingAndDoReportRow {
  channelType: number;
  channelId: number;
  channelName: string;
  productId: number;
  productName: string;

  monthlyConsumer: number;
  monthlyBulk: number;
  monthlyCorporate: number;
  monthlyCommodityTrading: number;
  monthlyTotal: number;

  dailyConsumer: number;
  dailyBulk: number;
  dailyCorporate: number;
  dailyCommodityTrading: number;
  dailyTotal: number;
}

export interface ILiftingAndDoReportResponse {
  reportHeader: ILiftingAndDoReportHeader;
  reportRows: ILiftingAndDoReportRow[];
}

export const liftingAndDoReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLiftingAndDoReport: builder.query<ILiftingAndDoReportResponse, ILiftingAndDoReportParams>({
      query: (params) => ({
        url: '/LiftingAndDoReport/lifting-and-do-report',
        method: 'GET',
        params, 
      }),
    }),
  }),
});

export const { useLazyGetLiftingAndDoReportQuery } = liftingAndDoReportApi;