import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models/user.model';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  /** 👤 get current logged-in user (private profile) */
  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  /** 🌍 get other user's public profile */
  /** 🌍 get other user's public profile */
getPublicProfile(userId: string): Observable<{ success: boolean; user: User }> {
  return this.http.get<{ success: boolean; user: User }>(
    `${this.apiUrl}/${userId}/profile`
  );
}


  /** ✏️ update profile (JSON only) */
  updateProfile(data: UpdateProfileRequest): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/update`, data);
  }

  /** 🖼️ update profile (with avatar upload) */
  updateProfileWithAvatar(formData: FormData): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/update`, formData);
  }

  /** 🔑 update password */
  updatePassword(data: UpdatePasswordRequest): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.apiUrl}/update-password`,
      data
    );
  }

  /** 👮 admin - get all users */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/all`);
  }
}
