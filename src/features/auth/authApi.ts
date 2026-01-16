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
  CreateListRequest,
  CreateListResponse,
  InviteUsersResponse,
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
  FeaturedBookmarksResponse
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
  FeaturedBookmarks,
  PublishedLists,
  FeaturedWishlists
} from './endpoints';

/* ================= API ================= */

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({

    /* ================= CAMPAIGNS ================= */

    getCampaigns: builder.query<Campaign[], void>({
      query: () => ({ url: '/scott-shafer/api/campaigns', method: 'GET' }),
      transformResponse: (res: CampaignsResponse) => res.campaigns,
      providesTags: ['Campaigns'],
    }),

    /* ================= FEATURED ITEMS ================= */

    shareFeaturedItem: builder.mutation<ShareFeaturedItemResponse, number | string>({
      query: itemId => ({
        url: `/scott-shafer/api/featured-items/${itemId}/share-link`,
        method: 'GET',
      }),
    }),

    bookmarkFeaturedItem: builder.mutation<BookmarkFeaturedItemResponse, number | string>({
      query: itemId => ({
        url: `/scott-shafer/api/featured-items/${itemId}/bookmark`,
        method: 'POST',
      }),
    }),

    likeFeaturedItem: builder.mutation<LikeFeaturedItemResponse, number | string>({
      query: itemId => ({
        url: FEATURED_ITEM_ENDPOINTS.LIKE_ITEM(itemId),
        method: 'POST',
      }),
      invalidatesTags: ['FeaturedList'],
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

    updateTermsAndPrivacy: builder.mutation<TermsAndPrivacyResponse, TermsAndPrivacyRequest>({
      query: body => ({
        url: AUTH_ENDPOINTS.TERMS_AND_PRIVACY,
        method: 'POST',
        body,
      }),
    }),

    /* ================= PROFILE ================= */

    getUserProfile: builder.query<ProfileResponse, void>({
      query: () => ({ url: AUTH_ENDPOINTS.GET_PROFILE, method: 'GET' }),
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
      query: () => ({ url: AUTH_ENDPOINTS.ALL_INTEREST, method: 'GET' }),
      transformResponse: (res: { data: Interest[] }) => res.data,
    }),

    getUserInterests: builder.query<Interest[], void>({
      query: () => ({ url: AUTH_ENDPOINTS.USE_INTEREST, method: 'GET' }),
      transformResponse: (res: { data: Interest[] }) => res.data,
    }),

    saveUserInterests: builder.mutation<SaveInterestsResponse, SaveInterestsRequest>({
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

    addListItem: builder.mutation<
      AddListItemResponse,
      { listId: number | string; custom_item_name: string; custom_text?: string; position?: number }
    >({
      query: ({ listId, ...body }) => ({
        url: `/scott-shafer/api/lists/${listId}/items`,
        method: 'POST',
        body,
      }),
    }),

    addCatalogItems: builder.mutation<
      AddListItemResponse,
      { listId: number; catalog_item_ids: number[]; position?: number }
    >({
      query: body => ({
        url: '/scott-shafer/api/lists/items',
        method: 'POST',
        body,
      }),
    }),

    getCatalogItemsOfList: builder.query<CatalogItem[], number>({
      query: listId => ({
        url: LIST_ENDPOINTS.ADD_LIST_ITEM(listId),
        method: 'GET',
      }),
      transformResponse: (res: ListCatalogItemsResponse) => res.data,
      providesTags: ['CatalogItems'],
    }),

    /* ================= CATALOG ================= */

    getCatalogCategories: builder.query<Category[], void>({
      query: () => CATALOG_ENDPOINTS.CATEGORIES,
      transformResponse: (res: CategoriesResponse) => res.data ?? [],
      providesTags: ['Categories'],
    }),

    getCatalogItemsByCategory: builder.query<CatalogItem[], number>({
      query: id => ({
        url: `/scott-shafer/api/catalog/items/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: CatalogItemsResponse) => res.data,
      providesTags: ['CatalogItems'],
    }),


    publishList: builder.mutation<CatalogItemsPublishList[], { list_ids: number[] }>({
      query: body => ({
        url: CATALOG_ENDPOINTS.PUBLISH_LIST,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FeaturedList'],
    }),

    /* ================= FEATURED LIST ================= */

    getFeaturedLists: builder.query<FeaturedListSummary[], { interestId?: number } | void>({
      query: args => ({
        url: FEATURED_LIST_ENDPOINTS.FEATURED_LISTS,
        method: 'GET',
        params: args?.interestId ? { interest_id: args.interestId } : undefined,
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

    getFeaturedListById: builder.query<FeaturedListsResponse, number | string>({
      query: id => ({
        url: FEATURED_LIST_ENDPOINTS.FEATURED_LIST_BY_ID(id),
        method: 'GET',
      }),
      providesTags: ['FeaturedList'],
    }),

    /* ================= NOTIFICATIONS ================= */

    getNotifications: builder.query<any[], void>({
      query: () => ({ url: Notification.NOTIFICATION_LIST, method: 'GET' }),
      providesTags: ['Notifications'],
    }),

    acceptNotification: builder.mutation<any, { list_id: number }>({
      query: body => ({
        url: Notification.ACCEPT_NOTIFICATION,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),

    rejectNotification: builder.mutation<any, { list_id: number }>({
      query: body => ({
        url: Notification.REJECT_NOTIFICATION,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),

    /* ================= RECOMMENDED ================= */

    getRecommendItems: builder.query<any[], void>({
      query: () => ({ url: Recommended.RECOMMENDED_LIST, method: 'GET' }),
      providesTags: ['RecommendItems'],
    }),

    likeRecommended: builder.mutation<any, number>({
      query: id => ({
        url: Recommended.RECOMMENDED_WISHLIST(id),
        method: 'POST',
      }),
      invalidatesTags: ['RecommendItems'],
    }),

    shareRecommended: builder.mutation<any, { id: number; platform: string }>({
      query: ({ id, platform }) => ({
        url: Recommended.RECOMMENDED_SHARE(id),
        method: 'POST',
        body: { platform },
      }),
      invalidatesTags: ['RecommendItems'],
    }),

    shareList: builder.query<any, number | string>({
      query: id => ({
        url: SHARE_LIST_ENDPOINT(id),
        method: 'GET',
      }),
    }),
    
    

    /* ================= BOOKMARKS ================= */

    getMyBookFeatured: builder.query<FeaturedBookmarksResponse, void>({
      query: () => ({
        url: FeaturedBookmarks.FEATURED_BOOKMARKS_LIST,
        method: 'GET',
      }),
      providesTags: ['Mybookmark'],
    }),

    deleteMyBookFeatured: builder.mutation<any, number | string>({
      query: id => ({
        url: FeaturedBookmarks.FEATURED_BOOKMARK_DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Mybookmark'],
    }),


    /* ================= PUBLISHED LISTS ================= */

    getMyPublishedLists: builder.query<PublishedListsResponse, void>({
      query: () => ({ url: PublishedLists.PUBLISHED_LISTS_GET, method: 'GET' }),
      providesTags: ['PublishedList'], // ✅ matches
    }),
    


postCurrentPublishedList: builder.mutation({
  query: body => ({
    url: PublishedLists.CURRENT_PUBLISHED_LIST_POST,
    method: 'POST',
    body,
  }),
  providesTags: ['PublishedList'],
}),

deletePublishedList: builder.mutation<any, number | string>({
  query: id => ({
    url: PublishedLists.DELETE_PUBLISHED_LIST(id),
    method: 'DELETE',
  }),
  invalidatesTags: ['PublishedList'],
}),


/* ================= WISHLIST ================= */

getMyWishlist: builder.query<FeaturedWishlistResponse, void>({
  query: () => ({
    url: FeaturedWishlists.WISHLIST_LIST,
    method: 'GET',
  }),
  providesTags: ['MyWishlist'],
}),

deleteMyWishlist: builder.mutation<any, number | string>({
  query: id => ({
    url: FeaturedWishlists.WISHLIST_DELETE(id),
    method: 'DELETE',
  }),
  invalidatesTags: ['MyWishlist'],
}),


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
  useAddCatalogItemsMutation,
  useGetCatalogItemsOfListQuery,
  useGetCatalogCategoriesQuery,
  useGetCatalogItemsByCategoryQuery,
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
  useShareListQuery,
  useLazyShareListQuery,
  useGetMyBookFeaturedQuery,
  useDeleteMyBookFeaturedMutation,
  usePublishListMutation,
  useGetMyPublishedListsQuery,
  usePostCurrentPublishedListMutation,
  useDeletePublishedListMutation,
  useGetMyWishlistQuery,
  useDeleteMyWishlistMutation
} = authApi;
