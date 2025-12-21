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
}
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

