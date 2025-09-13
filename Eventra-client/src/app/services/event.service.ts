import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, CreateEventRequest } from '../models/models/event.model';
import { Category } from '../models/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api/events';
  private categoriesUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) {}

  getEvents(page = 1, limit = 10, categoryId?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(eventData: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, eventData);
  }

  updateEvent(id: string, eventData: Partial<CreateEventRequest>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/my-events`);
  }

  approveEvent(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/approve`, {});
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }
  getAllByOrganizer(organizerId: string): Observable<Event[]> {
  return this.http.get<Event[]>(`${this.apiUrl}?organizer=${organizerId}`);
}
}