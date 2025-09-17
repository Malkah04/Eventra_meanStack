import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) this.redirectToDashboard();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.redirectToDashboard();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }

  redirectToDashboard(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate([this.returnUrl]);
      return;
    }

    const role = user.role?.toLowerCase();
    if (role === 'admin') this.router.navigate(['/admin/dashboard']);
    else if (role === 'organizer') this.router.navigate(['/organizer/dashboard']);
    else this.router.navigate([this.returnUrl]);
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control?.errors) return '';
    if (control.errors['required']) return `${field} is required`;
    if (control.errors['email']) return 'Enter a valid email';
    if (control.errors['minlength']) return `${field} must be at least 6 chars`;
    return '';
  }

  onGoogleLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user: SocialUser) => {
        if (user?.idToken) {
          this.authService.loginWithGoogle(user.idToken).subscribe({
            next: () => {
              this.isLoading = false;
              this.redirectToDashboard();
            },
            error: (err) => {
              this.isLoading = false;
              this.errorMessage = err.error?.message || 'Google login failed';
            }
          });
        } else {
          this.isLoading = false;
          this.errorMessage = 'Google login failed';
        }
      })
      .catch(() => {
        this.isLoading = false;
        this.errorMessage = 'Google login popup blocked or failed';
      });
  }
}
