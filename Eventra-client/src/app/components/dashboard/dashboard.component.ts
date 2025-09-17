import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { EventService } from '../../services/event.service';
import { User } from '../../models/models/user.model';
import { Booking } from '../../models/models/booking.model';
import { Event } from '../../models/models/event.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentBookings: Booking[] = [];
  upcomingEvents: Event[] = [];
  filteredEvents: Event[] = [];
  categories: { id: string, name: string }[] = [];
  selectedCategory: string = '';
  isLoading = false;
  events: any[]= [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private eventService: EventService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
    this.loadCategories();
    this.loadEvents();  // تحميل كل الأحداث في البداية
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res: any) => {
      this.categories = res.data.categories;
    });
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
  }

  loadEvents(categoryId?: string) {
  this.isLoading = true;
  this.eventService.getEvents(1, 100, categoryId).subscribe({
    next: (res: any) => {
      const allEvents: Event[] = res.data.events;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // نخلي المقارنة تبدأ من بداية اليوم

      // فلترة + ترتيب + اختيار أول 3
      this.upcomingEvents = allEvents
        .filter((event: Event) => {
          const eventDate = new Date(event.date);
          return eventDate >= today;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3); // هنا عشان يعرض 3 أحداث بس

      this.isLoading = false;
    },
    error: (err) => {
      console.error('Failed to load events:', err);
      this.isLoading = false;
    }
  });
}





  applyCategoryFilter(): void {
    if (this.selectedCategory) {
      this.filteredEvents = this.upcomingEvents.filter(event => event.categoryId._id === this.selectedCategory);
    } else {
      this.filteredEvents = [...this.upcomingEvents];
    }
  }

  onCategoryChange(): void {
    this.loadEvents(this.selectedCategory);
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
