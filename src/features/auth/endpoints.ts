// features/auth/endpoints/authEndpoints.ts
export const AUTH_ENDPOINTS = {
  REGISTER: '/scott-shafer/api/register',
  REQUEST_OTP: '/scott-shafer/api/request-otp',
  VERIFY_OTP: '/scott-shafer/api/verify-otp',
  PROFILE: '/auth/profile',
  TERMS_AND_PRIVACY: '/scott-shafer/api/termsAndPrivacy',
  ALL_INTEREST: '/scott-shafer/api/interest-list',
  USE_INTEREST: '/scott-shafer/api/user-interests',
  ADD_INTEREST: '/scott-shafer/api/add-interest',
  SAVE_USER: '/scott-shafer/api/user_profile',
  UPDATE_PROFILE: '/scott-shafer/api/update_profile',
  GET_PROFILE: '/scott-shafer/api/profile',
} as const;

export const FEATURED_LIST_ENDPOINTS = {
  // GET all featured lists
  FEATURED_LISTS: '/scott-shafer/api/featured-lists',

  // GET featured list detail
  FEATURED_LIST_BY_ID: (id: number | string) =>
    `/scott-shafer/api/featured-lists/${id}`,

  // ✅ GET featured list items only
  FEATURED_LIST_ITEMS: (id: number | string) =>
    `/scott-shafer/api/featured-lists/${id}/items`,
} as const;

export const LIST_ENDPOINTS = {
  CREATE_LIST: '/scott-shafer/api/lists',
  // ✅ ADD ITEM TO LIST
  ADD_LIST_ITEM: (listId: number | string) =>
    `/scott-shafer/api/lists/${listId}/items`,
} as const;

export const CATALOG_ENDPOINTS = {
  CATEGORIES: '/scott-shafer/api/catalog/categories',
  ITEMS: '/scott-shafer/api/catalog/items', // 👈 NEW
  UpdateList: '/scott-shafer/api/lists/Update',
  GetUpdateList: '/scott-shafer/api/Updatelists',
  PUBLISH_LIST: '/scott-shafer/api/lists/publish',
} as const;

// features/auth/endpoints/authEndpoints.ts

export const FEATURED_ITEM_ENDPOINTS = {
  LIKE_ITEM: (itemId: number | string) =>
    `/scott-shafer/api/featured-items/${itemId}/like`,
  SHARE_LINK: (itemId: number | string) =>
    `/scott-shafer/api/featured-items/${itemId}/share-link`,
} as const;

export const Notification = {
  NOTIFICATION_LIST: '/scott-shafer/api/my/notifications',
  ACCEPT_NOTIFICATION: '/scott-shafer/api/list-invites/accept',
  REJECT_NOTIFICATION: '/scott-shafer/api/list-invites/reject',
} as const;

export const Recommended = {
<<<<<<< HEAD

  SHARE_LIST: (listId: number | string) =>
    `/scott-shafer/api/lists/${listId}/share-link`,
  
=======
  SHARE_LIST: (listId: number | string) =>
    `/scott-shafer/api/lists/${listId}/share-link`,

>>>>>>> 5bcb889afeb85fbf9bfa322891d83d261e1db887
  RECOMMENDED_LIST: '/scott-shafer/api/recommeditems',

  RECOMMENDED_WISHLIST: (itemId: number | string) =>
    `/scott-shafer/api/lists/${itemId}/like`,

  RECOMMENDED_SHARE: (itemId: number | string) =>
    `/scott-shafer/api/lists/${itemId}/share`,

  RECOMMENDED_SHARE_LINK: (itemId: number | string) =>
    `/scott-shafer/api/lists/${itemId}/share-link`,
} as const;

export const FeaturedBookmarks = {
  // GET – Featured Lists Bookmarks
  FEATURED_BOOKMARKS_LIST: '/scott-shafer/api/me/featured-lists/bookmarks',

  // DELETE – Remove bookmark by ID
  FEATURED_BOOKMARK_DELETE: (bookmarkId: number | string) =>
    `/scott-shafer/api/featured-list-delete/${bookmarkId}`,
} as const;


export const SHARE_LIST_ENDPOINT = (listId: number | string) =>
  `/scott-shafer/api/lists/${listId}/share-link`;
