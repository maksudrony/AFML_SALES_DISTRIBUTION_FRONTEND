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
  // alada alada cache tags
  tagTypes: [
    'ProductCategory',
    'ProductDetail',
    'Channels',
    'Zones',
    'Divisions',
    'Areas',
    'Territories',
    'ProductWiseDeliveryReport', 
    'SummaryImsReport'
  ], 
  endpoints: () => ({}),
});