import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/models/user.model';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  user?: User;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadPublicProfile();
  }

  loadPublicProfile(): void {
  const userId = this.route.snapshot.paramMap.get('id');

  if (userId) {
    this.usersService.getPublicProfile(userId).subscribe({
      next: (res) => {
        this.user = res.user; // ✅ ناخد res.user مش res
        this.loading = false;
      },
      error: () => {
        this.errorMessage = '❌ User not found or profile is private';
        this.loading = false;
      }
    });
  } else {
    this.usersService.getMyProfile().subscribe({
      next: (res) => {
        this.user = res;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = '❌ Failed to load your profile';
        this.loading = false;
      }
    });
  }
}

  // 🖼️ Helper عشان نظبط اللينك
  getAvatarUrl(avatar: string | undefined | null): string {
    if (!avatar) return '';
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:5000${avatar}`;
  }
}
