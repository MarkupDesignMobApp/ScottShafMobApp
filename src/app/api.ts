import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';
import { getEnvConfig } from '../config/env';
const { apiUrl } = getEnvConfig();
// console.log(apiUrl);
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.markupdesigns.net',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: [
    'Auth',
    'Profile',
    'FeaturedList',
    'InviteUsers',
    'Lists',
    'Categories',
    'CatalogItems',
    'Campaigns'
  ],
  endpoints: () => ({}),
});
