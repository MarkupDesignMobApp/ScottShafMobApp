export interface AddListItemRequest {
  listId?: number | string;
  custom_item_name?: string;
  custom_text?: string;
  catalog_item_ids?: number[];
}

export interface ListItem {
  id: number;
  list_id: string;
  catalog_item_id: number | null;
  custom_item_name: string;
  custom_text: string;
  created_at: string;
  updated_at: string;
}
// features/auth/authTypes.ts

export interface ShareFeaturedItemResponse {
  success: boolean;
  message: string;
  share_url: string;
}

export interface AddListItemResponse {
  success: boolean;
  message: string;
  data: ListItem[];
}

export interface FeaturedListInterest {
  id: number;
  name: string;
}
export interface ListCatalogItemsResponse {
  success: boolean;
  data: CatalogItem[];
}

export interface FeaturedListCategory {
  id: number;
  name: string;
  interest: FeaturedListInterest;
}

export interface FeaturedList {
  id: number;
  title: string;
  image: string;
  category_id: string;
  list_size: string;
  status: string;
  display_order: string;
  category: FeaturedListCategory;
}

export interface FeaturedListsResponse {
  success: boolean;
  data: FeaturedList[];
}
// features/auth/authTypes.ts

export interface LikeFeaturedItemResponse {
  success: boolean;
  liked: boolean;
  data: {
    id: number;
    user_id: number;
    featured_list_item_id: string;
    created_at: string;
    updated_at: string;
  };
}

export interface BookmarkFeaturedItemResponse {
  success: boolean;
  saved: boolean;
  data: {
    id: number;
    user_id: number;
    featured_list_item_id: string;
    created_at: string;
    updated_at: string;
  };
}
// =====================================================
// INTEREST (USED EVERYWHERE)
// =====================================================

import { ImageSourcePropType } from 'react-native/types';

export interface FeaturedListInterest {
  id: number;
  name: string;
}

// =====================================================
// CATEGORY
// =====================================================

// Used in LIST API (category → interest)
export interface FeaturedListCategoryWithInterest {
  id: number;
  name: string;
  interest: FeaturedListInterest;
}

// Used in DETAIL API (category only)
export interface FeaturedListCategory {
  id: number;
  name: string;
}

export interface Campaign {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  status: string;
  requires_consent: boolean;
  starts_at: string;
  ends_at: string;
}

export interface CampaignsResponse {
  success: boolean;
  campaigns: Campaign[];
  message: string;
}


// =====================================================
// LIST API
// GET /scott-shafer/api/featured-lists
// =====================================================

export interface FeaturedListSummary {
  id: number;
  title: string;
  image: string;
  category_id: string;
  list_size: string;
  status: string;
  display_order: string;
  category: FeaturedListCategoryWithInterest;
}

export interface FeaturedListsResponse {
  success: boolean;
  data: FeaturedListSummary[];
}

// =====================================================
// DETAIL API
// GET /scott-shafer/api/featured-lists/{id}
// =====================================================

export interface FeaturedListItem {
  id: number;
  name: string;
  description: string;
  image: string;
  position: string;
}

export interface FeaturedListDetail {
  id: number;
  title: string;
  image: string;
  list_size: string;
  status: string;
  display_order: string;
  category: FeaturedListCategory;
  interest: FeaturedListInterest; // ✅ KEPT (IMPORTANT)
  items: FeaturedListItem[];
}

export interface FeaturedListDetailResponse {
  success: boolean;
  data: FeaturedListDetail;
}

// =====================================================
// OPTIONAL / FUTURE APIs
// =====================================================

// GET /featured-lists/{id}/items
export interface FeaturedListItemsResponse {
  success: boolean;
  data: FeaturedListItem[];
}

// GET /featured-lists?interest_id=6
export interface FeaturedListByInterestQuery {
  interest_id: number;
}

export interface FeaturedListItem {
  id: number;
  name: string;
  description: string;
  image: ImageSourcePropType | null;
  position: string;
}

export interface FeaturedListItemsResponse {
  success: boolean;
  data: FeaturedListItem[];
}

// ================= USER INTEREST =================

export interface Interest {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pivot?: {
    user_id: string;
    interest_id: string;
    created_at: string;
    updated_at: string;
  };
}

// ================= GET ALL INTERESTS =================
// GET /scott-shafer/api/interest-list

export interface InterestsResponse {
  success: boolean;
  data: Interest[];
}

// ================= SAVE USER INTERESTS =================
// POST /scott-shafer/api/add-interest

export interface SaveInterestsRequest {
  user_id: number;
  interests: number[];
}

export interface SaveInterestsResponse {
  success: boolean;
  message: string;
  user_id: number;
  selected_interests: number[];
}

// ================= USER =================
export interface User {
  id: number;
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  country: string;
  is_phone_verified: boolean;
  is_consent_completed: boolean;
  is_interest_completed: boolean;
  is_profile_completed: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

// ================= LOGIN =================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  access_token: string;
  token_type: string;
  created_at: string;
  expires_at: string;
}

// ================= OTP =================
export interface RequestOtpRequest {
  phone: string;
  country: string;
}

export interface RequestOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface VerifyOtpSuccessResponse {
  success: true;
  message: string;
  token: string;
  user: User;
}

export interface VerifyOtpOnboardingResponse {
  success: true;
  user_id: number;
  message: string;
  data: {
    is_consent: boolean;
    is_interest: boolean;
    is_profile: boolean;
  };
}

export interface VerifyOtpFailureResponse {
  success: false;
  message: string;
}

export type VerifyOtpResponse =
  | VerifyOtpSuccessResponse
  | VerifyOtpOnboardingResponse
  | VerifyOtpFailureResponse;

// ================= SIGNUP =================
export interface SignupRequest {
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  country: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    country: string;
    country_code: string;
  };
}

// ================= TERMS & PRIVACY =================
export interface TermsAndPrivacyRequest {
  accepted_terms_privacy: boolean;
  campaign_marketing: boolean;
  user_id: number | string;
}

export interface TermsAndPrivacyResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: string;
    accepted_terms_privacy: boolean;
    campaign_marketing: boolean;
    accepted_at: string;
    created_at: string;
    updated_at: string;
  };
}
// ================= CREATE LIST =================
// POST /scott-shafer/api/lists

export interface CreateListRequest {
  title: string;
  category_id: number;
  list_size: number;
  is_group: boolean;
  user_ids?: number[];
}

export interface CreateListResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    title: string;
    category_id: number;
    list_size: number;
    is_group: boolean;
    members: any[];
    created_at: string;
    updated_at: string;
  };
}

// ================= USER PROFILE =================
export interface UserProfileRequest {
  user_id: number;
  age_band: string;
  city: string;
  dining_budget: string;
  has_dogs: boolean;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    age_band: string;
    city: string;
    dining_budget: string;
    has_dogs: boolean;
    created_at: string;
    updated_at: string;
  };
}

// ================= UPDATE PROFILE =================
export interface UpdateProfileRequest {
  full_name: string;
  city: string;
  dining_budget: string;
  has_dogs: boolean;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    profile: {
      id: number;
      user_id: string;
      age_band: string;
      city: string;
      dining_budget: string;
      has_dogs: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface InviteUser {
  id: number;
  full_name: string;
  email: string;
}

export interface InviteUsersResponse {
  success: boolean;
  data: InviteUser[];
}
export interface Campaign {
  id: number;
  name: string;
  // add other fields returned by the campaign API here if available
}
export interface Category {
  id: number;
  name: string;
}
export interface CampaignsResponse {
  success: boolean;
  campaigns: Campaign[];
  message: string;
}
export interface Category {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}
// features/catalog/types/catalog.types.ts

export interface CatalogCategory {
  id: number;
  name: string;
}
// Categories API response
export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}
// Catalog Item
export interface CatalogItem {
  id: number;
  category_id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: Category;
}

export interface CatalogItemsResponse {
  success: boolean;
  message: string;
  data: CatalogItem[];
}

// ================= FULL PROFILE =================
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      full_name: string;
      email: string;
      phone: string;
      country: string;
      country_code: string;
      profile: {
        id: number;
        user_id: string;
        age_band: string;
        city: string;
        dining_budget: string;
        has_dogs: string;
      };
      consent: {
        id: number;
        user_id: string;
        accepted_terms_privacy: string;
        campaign_marketing: string;
        accepted_at: string;
      };

      interests: {
        id: number;
        name: string;
        pivot: {
          user_id: string;
          interest_id: string;
          created_at: string;
          updated_at: string;
        };
      }[];
    };
  };
}

//ListPublist
export interface CatalogItemsPublishList {
  list_ids: number[];
}


export interface FeaturedBookmarksResponse {
  success: boolean
  message: string
  data: FeaturedBookmarkItem[]
}

export interface FeaturedBookmarkItem {
  id: number
  title: string
  list_size: number
  status: 'live' | 'draft' | string

  category: {
    id: number
    name: string
  }

  interest: {
    id: number
    name: string
  }

  image: string

  likes_count: number
  saves_count: number
  shares_count: number

  is_liked: boolean
  is_saved: boolean
}
