import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToDashboard(): void {
    if (this.currentUser?.role?.toLowerCase() === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.currentUser?.role?.toLowerCase() === 'organizer') {
      this.router.navigate(['/organizer/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  goToProfileSettings(): void {
    this.router.navigate(['/profile']);
  }

  goToManageUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  goToPublicProfile(): void {
    if (this.currentUser?._id) {
      this.router.navigate([`/users/${this.currentUser._id}/profile`]);
    }
  }
}
