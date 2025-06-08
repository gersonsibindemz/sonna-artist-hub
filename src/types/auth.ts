
export interface User {
  id: string;
  email?: string;
  phone?: string;
  country_code: string;
  email_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export interface AuthResponse {
  user?: User;
  session?: Session;
  error?: string;
}
