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
  FeaturedListsResponse,
  FeaturedListSummary,
  FeaturedListItem,
  FeaturedListItemsResponse,
  FeaturedList,
} from './authTypes';
import { AUTH_ENDPOINTS, FEATURED_LIST_ENDPOINTS } from './endpoints';
export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // ✅ GET FEATURED LISTS BY INTEREST
    getFeaturedListsByInterest: builder.query<FeaturedList[], number | string>({
      query: interestId => ({
        url: FEATURED_LIST_ENDPOINTS.FEATURED_LISTS,
        method: 'GET',
        params: {
          interest_id: interestId,
        },
      }),
      transformResponse: (response: FeaturedListsResponse) => response.data,
      providesTags: ['FeaturedList'],
    }),

    // 🔹 GET FEATURED LIST ITEMS ONLY
    getFeaturedListItems: builder.query<FeaturedListItem[], number | string>({
      query: id => ({
        url: FEATURED_LIST_ENDPOINTS.FEATURED_LIST_ITEMS(id),
        method: 'GET',
      }),
      transformResponse: (res: FeaturedListItemsResponse) => res.data,
      providesTags: ['FeaturedList'],
    }),

    // ✅ GET ALL FEATURED LISTS
    getFeaturedLists: builder.query<FeaturedListSummary[], void>({
      query: () => ({
        url: FEATURED_LIST_ENDPOINTS.FEATURED_LISTS,
        method: 'GET',
      }),
      transformResponse: (res: FeaturedListsResponse) => res.data,
      providesTags: ['FeaturedList'],
    }),

    //Featured list details by id//
    getFeaturedListById: builder.query<FeaturedListsResponse, number | string>({
      query: id => ({
        url: FEATURED_LIST_ENDPOINTS.FEATURED_LIST_BY_ID(id),
        method: 'GET',
      }),
      providesTags: ['FeaturedList'],
    }),

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
    getUserInterests: builder.query<Interest[], void>({
      query: () => ({
        url: AUTH_ENDPOINTS.USE_INTEREST,
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
        url: AUTH_ENDPOINTS.ADD_INTEREST,
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
  useGetFeaturedListByIdQuery,
  useGetFeaturedListsQuery,
  useGetFeaturedListItemsQuery,
  useGetFeaturedListsByInterestQuery,
} = authApi;
