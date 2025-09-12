import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) this.email = params['email'];
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (!this.resetForm.valid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { otp, newPassword } = this.resetForm.value;

    this.authService.resetPassword({ email: this.email, otp, newPassword }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Password reset successfully!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid OTP or failed to reset password.';
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.resetForm.get(field);
    if (!control?.errors) return '';
    if (control.errors['required']) return `${field} is required`;
    if (control.errors['minlength']) return `${field} must be at least 6 chars`;
    if (field === 'confirmPassword' && this.resetForm.errors?.['mismatch']) return 'Passwords do not match';
    return '';
  }
}
