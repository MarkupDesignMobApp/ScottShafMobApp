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
  Interest,
  SaveInterestsResponse,
  SaveInterestsRequest,
  UserProfileRequest,
  UserProfileResponse,
  UpdateProfileResponse,
  ProfileResponse,
  FeaturedListsResponse,
  FeaturedListSummary,
  FeaturedListItem,
  FeaturedListItemsResponse,
  FeaturedList,
  CreateListRequest,
  CreateListResponse,
  InviteUsersResponse,
  AddListItemRequest,
  AddListItemResponse,
  Category,
  CategoriesResponse,
  CatalogItem,
  CatalogItemsResponse,
  ListCatalogItemsResponse,
  LikeFeaturedItemResponse,
  BookmarkFeaturedItemResponse,
  ShareFeaturedItemResponse,
  CampaignsResponse,
  Campaign,
  CatalogItemsPublishList,
  ShareListResponse,
} from './authTypes';

import {
  AUTH_ENDPOINTS,
  FEATURED_LIST_ENDPOINTS,
  LIST_ENDPOINTS,
  CATALOG_ENDPOINTS,
  FEATURED_ITEM_ENDPOINTS,
  Notification,
  Recommended,
  SHARE_LIST_ENDPOINT,
} from './endpoints';

/* ✅ NEW REQUEST TYPE FOR CATALOG ITEMS */
export interface AddCatalogItemsRequest {
  listId: number;
  catalog_item_ids: number[];
}

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCampaigns: builder.query<Campaign[], void>({
      query: () => ({
        url: '/scott-shafer/api/campaigns',
        method: 'GET',
      }),
      transformResponse: (res: CampaignsResponse) => res.campaigns,
      providesTags: ['Campaigns'],
    }),

    shareFeaturedItem: builder.mutation<
      ShareFeaturedItemResponse,
      number | string
    >({
      query: itemId => ({
        url: `/scott-shafer/api/featured-items/${itemId}/share-link`,
        method: 'GET', // ✅ BACKEND EXPECTS GET
      }),
    }),

    bookmarkFeaturedItem: builder.mutation<
      BookmarkFeaturedItemResponse,
      number | string
    >({
      query: itemId => ({
        url: `/scott-shafer/api/featured-items/${itemId}/bookmark`,
        method: 'POST',
      }),
    }),

    likeFeaturedItem: builder.mutation<
      LikeFeaturedItemResponse,
      number | string
    >({
      query: itemId => ({
        url: FEATURED_ITEM_ENDPOINTS.LIKE_ITEM(itemId),
        method: 'POST',
      }),
      invalidatesTags: ['FeaturedList'], // optional but recommended
    }),
    /* ================= AUTH ================= */

    requestOtp: builder.mutation<RequestOtpResponse, RequestOtpRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.REQUEST_OTP,
        method: 'POST',
        body,
      }),
    }),

    verifyOtp: builder.mutation<LoginResponse, VerifyOtpRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.VERIFY_OTP,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.REGISTER,
        method: 'POST',
        body,
      }),
    }),

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

    /* ================= PROFILE ================= */

    getUserProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.GET_PROFILE,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),

    updateUserProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: formData => ({
        url: AUTH_ENDPOINTS.UPDATE_PROFILE,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),

    saveUserProfile: builder.mutation<UserProfileResponse, UserProfileRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.SAVE_USER,
        method: 'POST',
        body,
      }),
    }),

    /* ================= INTERESTS ================= */

    getAllInterests: builder.query<Interest[], void>({
      query: () => ({
        url: AUTH_ENDPOINTS.ALL_INTEREST,
        method: 'GET',
      }),
      transformResponse: (res: { success: boolean; data: Interest[] }) =>
        res.data,
    }),

    getUserInterests: builder.query<Interest[], void>({
      query: () => ({
        url: AUTH_ENDPOINTS.USE_INTEREST,
        method: 'GET',
      }),
      transformResponse: (res: { success: boolean; data: Interest[] }) =>
        res.data,
    }),

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

    /* ================= LIST ================= */

    createList: builder.mutation<CreateListResponse, CreateListRequest>({
      query: body => ({
        url: LIST_ENDPOINTS.CREATE_LIST,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FeaturedList'],
    }),

    getInviteUsers: builder.query<InviteUsersResponse, void>({
      query: () => '/scott-shafer/api/users/invite-list',
      providesTags: ['InviteUsers'],
    }),

    addListItem: builder.mutation<AddListItemResponse, AddListItemRequest>({
      query: ({ listId, custom_item_name, custom_text }) => ({
        url: LIST_ENDPOINTS.ADD_LIST_ITEM(listId),
        method: 'POST',
        body: {
          custom_item_name,
          custom_text,
        },
      }),
    }),

    /* ✅ FIXED: ADD CATALOG ITEMS TO LIST */
    addCatalogItemToList: builder.mutation<
      AddListItemResponse,
      AddCatalogItemsRequest
    >({
      query: ({ listId, catalog_item_ids }) => ({
        url: LIST_ENDPOINTS.ADD_LIST_ITEM(listId),
        method: 'POST',
        body: {
          catalog_item_ids,
        },
      }),
    }),
    getCatalogItemsOfList: builder.query<CatalogItem[], number>({
      query: listId => ({
        url: LIST_ENDPOINTS.ADD_LIST_ITEM(listId), // ✅ SAME URL
        method: 'GET', // ✅ GET instead of POST
      }),
      transformResponse: (res: ListCatalogItemsResponse) => res.data,
      providesTags: ['CatalogItems'],
    }),

    /* ================= CATALOG ================= */

    getCatalogCategories: builder.query<Category[], void>({
      query: () => CATALOG_ENDPOINTS.CATEGORIES,
      transformResponse: (response: CategoriesResponse) => response.data ?? [],
      providesTags: ['Categories'],
    }),

    getCatalogItemsByCategory: builder.query<CatalogItem[], number>({
      query: categoryId => ({
        url: CATALOG_ENDPOINTS.ITEMS,
        method: 'GET',
        params: {
          category_id: categoryId,
        },
      }),
      transformResponse: (response: CatalogItemsResponse) => response.data,
      providesTags: ['CatalogItems'],
    }),

    publishList: builder.mutation<
      CatalogItemsPublishList[],
      { list_ids: number[] }
    >({
      query: body => ({
        url: CATALOG_ENDPOINTS.PUBLISH_LIST,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FeaturedList'],
    }),

    /* ================= FEATURED LIST ================= */

    getFeaturedLists: builder.query<
      FeaturedListSummary[],
      { interestId?: number } | void
    >({
      query: args => ({
        url: FEATURED_LIST_ENDPOINTS.FEATURED_LISTS,
        method: 'GET',
        params: args?.interestId ? { interest_id: args.interestId } : undefined, // 👈 For You (no query param)
      }),
      transformResponse: (res: FeaturedListsResponse) => res.data,
      providesTags: ['FeaturedList'],
    }),

    getFeaturedListItems: builder.query<FeaturedListItem[], number | string>({
      query: id => ({
        url: FEATURED_LIST_ENDPOINTS.FEATURED_LIST_ITEMS(id),
        method: 'GET',
      }),
      transformResponse: (res: FeaturedListItemsResponse) => res.data,
      providesTags: ['FeaturedList'],
    }),

    // 🔹 GET Notification List
    getNotifications: builder.query<any[], void>({
      query: () => ({
        url: Notification.NOTIFICATION_LIST,
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),

    // 🔹 Accept Notification
    acceptNotification: builder.mutation<any, { list_id: number }>({
      query: body => ({
        url: Notification.ACCEPT_NOTIFICATION,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),

    // 🔹 Reject Notification
    rejectNotification: builder.mutation<any, { list_id: number }>({
      query: body => ({
        url: Notification.REJECT_NOTIFICATION,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),

    getFeaturedListById: builder.query<FeaturedListsResponse, number | string>({
      query: id => ({
        url: FEATURED_LIST_ENDPOINTS.FEATURED_LIST_BY_ID(id),
        method: 'GET',
      }),
      providesTags: ['FeaturedList'],
    }),

    getRecommendItems: builder.query<any[], void>({
      query: () => ({
        url: Recommended.RECOMMENDED_LIST,
        method: 'GET',
      }),
      providesTags: ['RecommendItems'],
    }),

    // features/auth/authApi.ts

    shareList: builder.query<ShareListResponse, number | string>({
      query: listId => ({
        url: SHARE_LIST_ENDPOINT(listId),
        method: 'GET',
      }),
    }),

    likeRecommended: builder.mutation({
      query: id => ({
        url: Recommended.RECOMMENDED_WISHLIST(id),
        method: 'POST',
      }),
      providesTags: ['RecommendItems'],
    }),

    shareRecommended: builder.mutation({
      query: ({ id, platform }) => ({
        url: Recommended.RECOMMENDED_SHARE(id),
        method: 'POST',
        data: {
          platform,
        },
      }),
      providesTags: ['RecommendItems'],
    }),
    // shareList: builder.query<ShareListResponse, number | string>({
    //   query: listId => ({
    //     url: Recommended.SHARE_LIST(listId),
    //     method: 'GET',
    //   }),
    // }),
  }),
});

/* ================= HOOK EXPORTS ================= */

export const {
  useRequestOtpMutation,
  useVerifyOtpMutation,
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
  useCreateListMutation,
  useGetInviteUsersQuery,
  useAddListItemMutation,
  useGetCatalogCategoriesQuery,
  useGetCatalogItemsByCategoryQuery,
  useAddCatalogItemToListMutation,
  useGetCatalogItemsOfListQuery,
  useLikeFeaturedItemMutation,
  useBookmarkFeaturedItemMutation,
  useShareFeaturedItemMutation,
  useGetCampaignsQuery,
  useAcceptNotificationMutation,
  useGetNotificationsQuery,
  useRejectNotificationMutation,
  useGetRecommendItemsQuery,
  useLikeRecommendedMutation,
  useShareRecommendedMutation,
  useLazyShareListQuery,
  useShareListQuery,
} = authApi;
