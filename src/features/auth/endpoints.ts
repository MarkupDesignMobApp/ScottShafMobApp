// features/auth/endpoints/authEndpoints.ts
export const AUTH_ENDPOINTS = {
  REGISTER: '/scott-shafer/api/register',
  REQUEST_OTP: '/scott-shafer/api/request-otp',
  VERIFY_OTP: '/scott-shafer/api/verify-otp',
  PROFILE: '/auth/profile',
  TERMS_AND_PRIVACY: '/scott-shafer/api/termsAndPrivacy',
  ALL_INTEREST: '/scott-shafer/api/interests',
  USE_INTEREST: '/scott-shafer/api/user/interests',
  SAVE_USER: '/scott-shafer/api/user_profile',
  UPDATE_PROFILE: '/scott-shafer/api/update_profile',
  GET_PROFILE:'/scott-shafer/api/profile'
} as const;
