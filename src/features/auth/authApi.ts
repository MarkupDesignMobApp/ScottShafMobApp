import { baseApi } from '../../app/api';
import { LoginRequest, LoginResponse } from './authTypes';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: '/mai-beta/api/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    getProfile: builder.query<LoginResponse['user'], void>({
      query: () => '/auth/profile',
      providesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = authApi;
