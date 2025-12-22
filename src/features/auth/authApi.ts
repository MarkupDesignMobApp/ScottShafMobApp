// features/auth/authApi.ts
import { baseApi } from '../../app/api';
import {
  RequestOtpRequest,
  RequestOtpResponse,
  VerifyOtpRequest,
  LoginResponse,
  SignupResponse,
  SignupRequest
} from './authTypes';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: body => ({
        url: '/scott-shafer/api/register',
        method: 'POST',
        body,
      }),
      transformResponse: (response: SignupResponse, meta) => {
        // ✅ Allow ONLY 201 + success true
        if (meta?.response?.status === 201 && response.success) {
          return response;
        }

        // ❌ Force error for everything else
        throw {
          data: response,
          status: meta?.response?.status,
        };
      },
    }),
    // 1️⃣ SEND OTP (no auth change)
    requestOtp: builder.mutation<
      RequestOtpResponse,
      RequestOtpRequest
    >({
      query: body => ({
        url: '/scott-shafer/api/request-otp',
        method: 'POST',
        body,
      }),
   
   
    }),

    // 2️⃣ VERIFY OTP = LOGIN (auth change)
    verifyOtp: builder.mutation<LoginResponse, VerifyOtpRequest>({
      query: body => ({
        url: '/scott-shafer/api/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'], // ✅ IMPORTANT
    }),

    // 3️⃣ GET PROFILE (depends on auth)
    getProfile: builder.query<LoginResponse['user'], void>({
      query: () => '/auth/profile',
      providesTags: ['Auth'], // ✅ PAIR
    }),
  }),
});

export const {
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useGetProfileQuery,
  useSignupMutation
} = authApi;
