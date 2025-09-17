import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/models/user.model';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  loading = false;
  message = '';
  avatarFile: File | null = null;
  avatarPreview: string | null = null; // 👈 للعرض قبل الرفع

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadProfile();

    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      bio: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loadProfile(): void {
    this.loading = true;
    this.usersService.getMyProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          bio: data.bio
        });
        this.loading = false;
      },
      error: () => {
        this.message = '❌ Failed to load profile';
        this.loading = false;
      }
    });
  }

  onAvatarSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.avatarFile = file;

      // preview محلي
      const reader = new FileReader();
      reader.onload = () => (this.avatarPreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;

    const formData = new FormData();
    formData.append('firstName', this.profileForm.value.firstName);
    formData.append('lastName', this.profileForm.value.lastName);
    formData.append('phone', this.profileForm.value.phone || '');
    formData.append('bio', this.profileForm.value.bio || '');
    if (this.avatarFile) formData.append('avatar', this.avatarFile);

    this.usersService.updateProfileWithAvatar(formData).subscribe({
      next: (res) => {
        this.message = '✅ Profile updated successfully';
        this.user = res;
        this.avatarPreview = null;
        this.authService.updateCurrentUser(res); // 🔥 تحديث الـ navbar
      },
      error: () => {
        this.message = '❌ Failed to update profile';
      }
    });
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) return;

    this.usersService.updatePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.message = '✅ Password updated successfully';
        this.passwordForm.reset();
      },
      error: () => {
        this.message = '❌ Failed to update password';
      }
    });
  }

  // 🖼️ Helper عشان نظبط اللينك
  getAvatarUrl(avatar: string | undefined | null): string {
    if (!avatar) return '';
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:5000${avatar}`;
  }
}
