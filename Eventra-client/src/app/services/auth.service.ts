import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ConfirmEmailRequest
} from '../models/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (accessToken && userData) {
      try {
        const user: User = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  // ----------- LOGIN -----------
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(res => this.storeUserData(res)));
  }

  // ----------- SIGNUP -----------
  signup(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData)
      .pipe(tap(res => this.storeUserData(res)));
  }

  // ----------- LOGIN WITH GOOGLE -----------
  loginWithGoogle(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-login`, { token })
      .pipe(tap(res => this.storeUserData(res)));
  }

  // ----------- CONFIRM EMAIL -----------
  confirmEmail(data: ConfirmEmailRequest): Observable<any> {
    return this.http.patch(`${this.apiUrl}/confirm-email`, data);
  }

  resendConfirmEmail(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-confirm-email`, data);
  }

  // ----------- FORGOT / RESET PASSWORD -----------
  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  // ----------- LOGOUT -----------
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ----------- STORE USER DATA -----------
  private storeUserData(response: any): void {
    // handle both { data: {...} } and direct {...}
    const data = response.data || response;

    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      this.currentUserSubject.next(data.user);
    }
  }

  // ----------- HELPERS -----------
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role?.toLowerCase() === 'admin';
  }

  isOrganizer(): boolean {
    return this.getCurrentUser()?.role?.toLowerCase() === 'organizer';
  }

  isUser(): boolean {
    return this.getCurrentUser()?.role?.toLowerCase() === 'user';
  }
}
