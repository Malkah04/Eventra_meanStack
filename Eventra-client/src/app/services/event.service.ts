import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5000/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getEventById(id: string): Observable<any> {
    return this.http.get('${this.apiUrl}/${id}');
  }

  createEvent(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateEvent(id: string, data: any): Observable<any> {
    return this.http.put('${this.apiUrl}/${id}', data);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete('${this.apiUrl}/${id}');
  }
}