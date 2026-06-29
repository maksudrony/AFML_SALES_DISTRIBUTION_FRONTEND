import { baseApi } from './api';

export interface IProductWiseDeliveryReportParams {
  fromDate: string;
  todate: string;
  entryBy: string;
  productId: number | null;
}

export const productWiseDeliveryReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductWiseDeliveryReport: builder.query<any[], IProductWiseDeliveryReportParams>({
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