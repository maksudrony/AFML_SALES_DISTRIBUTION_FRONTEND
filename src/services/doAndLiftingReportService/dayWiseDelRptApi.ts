import { baseApi } from '../api';

export interface IDayWiseDelRptMstParams {
  fromDate: string;
  toDate: string;
  fromTime: number;
  toTime: number;
  channelId: number | null;
  distribId: number | null;
  entryBy: string;
}

export interface IDayWiseDelRptMstRow {
  dcId: number;
  dcNo: string;
  dcDate: string;
  confirmDate: string;

  doId: number;
  doNo: string;
  channelId: number;
  channelName: string;

  zoneId: number;
  zoneName: string;
  divisionId: number;
  areaId: number;
  territoryId: number;
  territoryName: string;

  distribId: number;
  distribCode: string;
  distribName: string;
  challanQty: number;
}

export interface IDayWiseDelRptDtlParams {
  dcId: number;
}

export interface IDayWiseDelRptDtlRow {
  dcId: number;
  productId: number;
  prodCode: string;
  prodName: string;
  unitName: string;
  challanQty: number;
  productPrice: number;
  challanValue: number;
}

export const dayWiseDelRptApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDayWiseDelRptMst: builder.query<IDayWiseDelRptMstRow [], IDayWiseDelRptMstParams>({
      query: (params) => ({
        url: '/DayWiseDelRpt/day-wise-del-rpt-mst',
        method: 'GET',
        params, 
      }),
      keepUnusedDataFor: 0,
    }),

    getDayWiseDelRptDtl: builder.query<IDayWiseDelRptDtlRow[], IDayWiseDelRptDtlParams>({
      query: (params) => ({
        url: '/DayWiseDelRpt/day-wise-del-rpt-dtl',
        method: 'GET',
        params, 
      }),
      keepUnusedDataFor: 0, //no cache for query
    }),
  }),
});

export const { useGetDayWiseDelRptMstQuery, useLazyGetDayWiseDelRptDtlQuery } = dayWiseDelRptApi;