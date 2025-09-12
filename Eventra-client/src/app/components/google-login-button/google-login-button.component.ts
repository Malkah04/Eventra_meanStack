import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-google-login-button',
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.css']
})
export class GoogleLoginButtonComponent {
  isLoading = false;
  errorMessage = '';

  @Output() loginSuccess = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService
  ) {}

  onGoogleLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(user => {
        if (user?.idToken) {
          this.authService.loginWithGoogle(user.idToken).subscribe({
            next: () => {
              this.isLoading = false;
              this.loginSuccess.emit();
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
