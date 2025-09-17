import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Booking, CreateBookingRequest } from '../models/models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/bookings';

  constructor(private http: HttpClient) {}

  // جلب حجوزاتي (آخر الحجوزات للمستخدم الحالي)
  getMyBookings(): Observable<Booking[]> {
    return this.http.get<{ data: { bookings: Booking[] } }>(this.apiUrl).pipe(
      map(res => res.data.bookings) // نخليها Array مباشرة
    );
  }

  // إنشاء حجز جديد
  createBooking(bookingData: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, bookingData);
  }

  // إلغاء الحجز
  cancelBooking(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cancel`, {});
  }

  // جلب حجز محدد بالـ id
  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  // جلب كل الحجوزات (للأدمن غالبًا)
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<{ data: { bookings: Booking[] } }>(`${this.apiUrl}/all`).pipe(
      map(res => res.data.bookings)
    );
  }
}
