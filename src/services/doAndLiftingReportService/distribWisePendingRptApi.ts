import { baseApi } from '../api';

export interface IDistribWisePendingRptParams {
  fromDate: string;
  toDate: string;
  channelId: number | null;
  zoneId: number | null;
  divisionId: number | null;
  areaId: number | null;
  territoryId: number | null;
  productId: number | null;
  distribId: number | null;
  orderTypeId: number;
}

export interface IDistribWisePendingRptRow {
  channelId: number;
  channelName: string;

  divisionName: string;
  territoryName: string;

  distribCode: string;
  distribName: string;

  doId: number;
  doNo: string;
  doDate: string;

  poNo: string;
  deliveryPoint: string;

  productId: number;
  prodName: string;

  productPrice: number;

  doQtyBag: number;
  doQtyTon: number;

  pendingQtyBag: number;
  pendingQtyTon: number;
}

export const distribWisePendingRptApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistribWisePendingRpt: builder.query<IDistribWisePendingRptRow [], IDistribWisePendingRptParams>({
      query: (params) => ({
        url: '/DistribWisePendingRpt/distrib-wise-pending-rpt',
        method: 'GET',
        params, 
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLazyGetDistribWisePendingRptQuery } = distribWisePendingRptApi;