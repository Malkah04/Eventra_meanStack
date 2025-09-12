import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { EventService } from '../../services/event.service';
import { User } from '../../models/models/user.model';
import { Booking } from '../../models/models/booking.model';
import { Event } from '../../models/models/event.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentBookings: Booking[] = [];
  upcomingEvents: Event[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        this.recentBookings = bookings.slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });

    this.eventService.getEvents(1, 6).subscribe({
      next: (response) => {
        this.upcomingEvents = response.events;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return price === 0 ? 'Free' : `$${price}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  }
}
