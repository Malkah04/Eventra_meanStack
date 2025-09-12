import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (!this.forgotForm.valid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword({ email: this.forgotForm.value.email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'OTP sent to your email. Check your inbox.';
        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { email: this.forgotForm.value.email }
          });
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send OTP. Try again.';
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.forgotForm.get(field);
    if (!control?.errors) return '';
    if (control.errors['required']) return `${field} is required`;
    if (control.errors['email']) return 'Enter a valid email';
    return '';
  }
}
