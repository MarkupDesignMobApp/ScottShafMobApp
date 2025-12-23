export interface User {
  id: string;
  name: string;
  email: string;
}

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

export interface RequestOtpRequest {
  phone: string;
  country: string;
}

export interface RequestOtpResponse {
  success: boolean;
  message: string;
}
export type VerifyOtpRequest = {
  phone: string;
  otp: string;
};
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

// features/auth/authTypes.ts

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
// features/interests/interestsTypes.ts
export interface Interest {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pivot: {
    user_id: string;
    interest_id: string;
    created_at: string;
    updated_at: string;
  };
}

export interface InterestsResponse {
  success: boolean;
  data: Interest[];
}

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

export interface Interest {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pivot: {
    user_id: string;
    interest_id: string;
    created_at: string;
    updated_at: string;
  };
}
// features/auth/authTypes.ts
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

// features/auth/authTypes.ts
export interface UpdateProfileRequest {
  full_name: string;
  city: string;
  dining_budget: string;
  has_dogs: boolean;
}

// features/auth/authTypes.ts
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
    user: {
      id: number;
      full_name: string;
      email: string;
      country_code: string;
      phone: string;
      country: string;
      is_phone_verified: string;
      is_consent_completed: string;
      is_interest_completed: string;
      is_profile_completed: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
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
        has_dogs: string; // "1" | "0"
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
