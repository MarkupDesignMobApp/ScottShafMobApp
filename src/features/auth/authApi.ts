// features/auth/authApi.ts
import { baseApi } from '../../app/api';
import {
  RequestOtpRequest,
  RequestOtpResponse,
  VerifyOtpRequest,
  LoginResponse,
  SignupResponse,
  SignupRequest,
  TermsAndPrivacyRequest,
  TermsAndPrivacyResponse,
  InterestsResponse,
  SaveInterestsResponse,
  SaveInterestsRequest,
  Interest,
  UserProfileRequest,
  UserProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ProfileResponse,
  VerifyOtpResponse,
} from './authTypes';
import { AUTH_ENDPOINTS } from './endpoints';
export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.VERIFY_OTP,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    getUserProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.GET_PROFILE,
        method: 'GET',
      }),
      providesTags: ['Profile'], // ✅ FIXED
    }),

    updateUserProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: formData => ({
        url: AUTH_ENDPOINTS.UPDATE_PROFILE,
        method: 'POST', // or PUT if backend expects it
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // ✅ SAVE USER PROFILE
    saveUserProfile: builder.mutation<UserProfileResponse, UserProfileRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.SAVE_USER,
        method: 'POST',
        body,
      }),
    }),
    // 1️⃣ ALL INTERESTS
    getAllInterests: builder.query<Interest[], void>({
      query: () => ({
        url: AUTH_ENDPOINTS.ALL_INTEREST,
        method: 'GET',
      }),
      transformResponse: (res: { success: boolean; data: Interest[] }) =>
        res.data,
    }),

    // 2️⃣ USER SELECTED INTERESTS
    getUserInterests: builder.query<Interest[], number>({
      query: userId => ({
        url: `${AUTH_ENDPOINTS.USE_INTEREST}/${userId}`,
        method: 'GET',
      }),
      transformResponse: (res: { success: boolean; data: Interest[] }) =>
        res.data,
    }),

    // 3️⃣ SAVE USER INTERESTS
    saveUserInterests: builder.mutation<
      SaveInterestsResponse,
      SaveInterestsRequest
    >({
      query: body => ({
        url: AUTH_ENDPOINTS.USE_INTEREST,
        method: 'POST',
        body,
      }),
    }),

    // SIGN UP
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.REGISTER,
        method: 'POST',
        body,
      }),
    }),

    // 1️⃣ SEND OTP (no auth change)
    requestOtp: builder.mutation<RequestOtpResponse, RequestOtpRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.REQUEST_OTP,
        method: 'POST',
        body,
      }),
    }),
    // ✅ TERMS & PRIVACY
    updateTermsAndPrivacy: builder.mutation<
      TermsAndPrivacyResponse,
      TermsAndPrivacyRequest
    >({
      query: body => ({
        url: AUTH_ENDPOINTS.TERMS_AND_PRIVACY,
        method: 'POST',
        body,
      }),
    }),

    // 2️⃣ VERIFY OTP = LOGIN (auth change)
    verifyOtp: builder.mutation<LoginResponse, VerifyOtpRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.VERIFY_OTP,
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
  useSignupMutation,
  useUpdateTermsAndPrivacyMutation,
  useGetAllInterestsQuery,
  useGetUserInterestsQuery,
  useSaveUserInterestsMutation,
  useSaveUserProfileMutation,
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
} = authApi;
