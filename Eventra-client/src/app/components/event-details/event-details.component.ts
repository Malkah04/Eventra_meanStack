import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { BookingService } from 'src/app/services/booking.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {
  event?: any;
  isOrganizer: boolean = false;
  isAttendee: boolean = false;
  bookings: any[] = [];
  loadingBookings: boolean = false;
  ticketQuantity: number = 1;
  showComments = false;
  toggleComment() {
    this.showComments = !this.showComments;
  }

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id')!;
    this.loadEvent(eventId);

    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser); // للتأكد من البيانات
    this.isOrganizer = currentUser?.role?.toLowerCase() === 'organizer';
    this.isAttendee = currentUser?.role?.toLowerCase() === 'user';
  }

  loadEvent(eventId: string) {
    this.eventService.getEventById(eventId).subscribe({
      next: (res: any) => {
        this.event = res.data.event;
        if (this.isOrganizer) {
          this.loadBookings(eventId);
        }
      },
      error: (err) => {
        console.error('Failed to load event:', err);
      },
    });
  }

  loadBookings(eventId: string) {
    this.loadingBookings = true;
    this.bookingService.getBookingById(eventId).subscribe({
      next: (res: any) => {
        this.bookings = res.data.bookings || [];
        this.loadingBookings = false;
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
        this.loadingBookings = false;
      },
    });
  }

  bookTicket() {
    alert('Booking ticket feature coming soon!');
  }

  addToCart() {
    if (this.ticketQuantity < 1) {
      alert('Please select at least 1 ticket.');
      return;
    }
    console.log(
      `Added ${this.ticketQuantity} tickets for event ${
        this.event?.name || 'unknown'
      } to cart.`
    );
    alert(`${this.ticketQuantity} tickets added to cart!`);
  }
}
