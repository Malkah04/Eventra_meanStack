// src/app/models/models/user.model.ts
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';

  // optional fields
  phone?: string | null;
  avatar?: string | null;
  gender?: 'male' | 'female' | 'other';
  bio?: string | null;
  confirmEmailAt?: string | null;
  freezedAt?: string | null;

  createdAt: string;
  updatedAt: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;       // بدل username
  email: string;
  password: string;
  role: 'user' | 'organizer';
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ConfirmEmailRequest {
  email: string;
  otp: string;
}
