import { baseApi } from './api';
import type { ICommonParameterDto } from '../types/commonParameters';

export const reportTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportType: builder.query<ICommonParameterDto[], void>({
      query: () => ({
        url: `/CommonParameters/report-type`,
        method: 'GET',
      }),
      providesTags: ['ReportType'], 
    }),
  }),
});

export const { useGetReportTypeQuery } = reportTypeApi;