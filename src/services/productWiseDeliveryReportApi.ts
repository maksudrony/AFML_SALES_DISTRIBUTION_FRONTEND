import { baseApi } from './api';
export interface IProductWiseDeliveryReportParams {
  fromDate: string;
  todate: string;
  entryBy: string;
  productId: number | null;
}

export interface IDeliveryReportRow {
  prodCode: string;
  prodName: string;
  bagDelQty: number;
  delTon: number;
  deliveryValue: number;
  ratePerBag: number;
  ratePerMt: number;
  bagReturnQty: number;
  totReturnValue: number;
  returnQtyTon: number;
  netDelQty: number;
  netDelValue: number;
}

export const productWiseDeliveryReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductWiseDeliveryReport: builder.query<IDeliveryReportRow[], IProductWiseDeliveryReportParams>({
      query: (params) => ({
        url: '/ProductWiseDeliveryReport/product-wise-delivery-report',
        method: 'GET',
        params, 
      }),
      providesTags: ['ProductWiseDeliveryReport'],
    }),
  }),
});

export const { useLazyGetProductWiseDeliveryReportQuery } = productWiseDeliveryReportApi;