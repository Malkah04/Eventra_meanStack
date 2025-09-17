import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, CreateEventRequest } from '../models/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  // 📌 Get all events with pagination + filter by category
  getEvents(page = 1, limit = 10, categoryId?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<any>(this.apiUrl, { params });
    
  }

  // 📌 Get organizer's own events
  getMyEvents(categoryId?: string): Observable<{ message: string; data: { events: Event[] } }> {
    let params = new HttpParams();
    
    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    return this.http.get<{ message: string; data: { events: Event[] } }>(
      `${this.apiUrl}/my`, { params }
    );
  }

  // 📌 Get upcoming events
  getUpcomingEvents(): Observable<{ message: string; data: { events: Event[] } }> {
    return this.http.get<{ message: string; data: { events: Event[] } }>(
      `${this.apiUrl}/upcoming`
    );
  }

  // 📌 Get event by ID
  getEventById(id: string): Observable<{ message: string; data: { event: Event } }> {
    return this.http.get<{ message: string; data: { event: Event } }>(
      `${this.apiUrl}/${id}`
    );
  }

  // 📌 Create new event
  createEvent(event: CreateEventRequest): Observable<{ message: string; data: Event }> {
    return this.http.post<{ message: string; data: Event }>(
      this.apiUrl,
      event
    );
  }

  // 📌 Update event
  updateEvent(id: string, eventData: Partial<CreateEventRequest>): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}`, eventData);
  }

  // 📌 Delete event
  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
