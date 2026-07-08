import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { storage } from '../utils/storage';
import { clearAuthCredentials } from '../features/auth/authSlice';
import { clearUiState } from '../features/ui/uiSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5205/api',
  prepareHeaders: (headers) => {
    const token = storage.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // parameter pathanor age parameter er null value undefine kortesi jate jhamela na kore!
  if (args && typeof args === 'object' && 'params' in args && args.params) {
    const originalParams = args.params as Record<string, unknown>;
    
    const cleanParams = Object.entries(originalParams).reduce((acc, [key, value]) => {

      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);

    args.params = cleanParams;
  }

  const result = await rawBaseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    storage.clearAll();
    api.dispatch(clearAuthCredentials());
    api.dispatch(clearUiState());
    window.location.href = '/'; 
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'ProductCategory',
    'ProductDetail',
    'Channels',
    'Zones',
    'Divisions',
    'Areas',
    'Territories',
    'ProductWiseDeliveryReport', 
    'SummaryImsReport',
    'SalesChannelType',
    'QuantityType',
    'ReportType',
  ], 
  endpoints: () => ({}),
});