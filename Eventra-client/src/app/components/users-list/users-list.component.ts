import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/user.service';
import {User } from '../../models/models/user.model'
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  loading = true;
  errorMessage = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ API error:', err);
        this.errorMessage = '❌ Failed to load users';
        this.loading = false;
      }
    });
  }
  getAvatarUrl(avatar: string | undefined | null): string {
  if (!avatar) return 'assets/default-avatar.png'; // صورة افتراضية
  if (avatar.startsWith('http')) return avatar;
  return `http://localhost:5000${avatar}`; // backend server
}

}
