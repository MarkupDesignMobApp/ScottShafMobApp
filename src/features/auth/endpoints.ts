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
} as const;

// features/auth/endpoints/authEndpoints.ts

export const FEATURED_ITEM_ENDPOINTS = {
  LIKE_ITEM: (itemId: number | string) =>
    `/scott-shafer/api/featured-items/${itemId}/like`,
    SHARE_LINK: (itemId: number | string) =>
    `/scott-shafer/api/featured-items/${itemId}/share-link`,
} as const;
