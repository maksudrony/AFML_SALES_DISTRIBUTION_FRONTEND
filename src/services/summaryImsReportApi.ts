import { baseApi } from './api';

export interface ISummaryImsReportParams {
  fromDate: string;
  toDate: string;
  prodCatId: number | null;
  entryBy: string;
  channelId: number | null;
  zoneId: number | null;
  divisionId: number | null;
  areaId: number | null;
  territoryId: number | null;
}

export interface IImsReportRow {
  territoryName: string;
  distribName: string;
  soEnrol: string;
  empName: string;
  joiningDate: string;
  grandTotal: number;
  daysData?: Record<string, number>;
}

export const summaryImsReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSummaryImsReport: builder.query<IImsReportRow[], ISummaryImsReportParams>({
      query: (params) => ({
        url: '/SummaryImsReport/summary-ims-report',
        method: 'GET',
        params,
      }),
      providesTags: ['SummaryImsReport'],
    }),
  }),
});

export const { useLazyGetSummaryImsReportQuery } = summaryImsReportApi;