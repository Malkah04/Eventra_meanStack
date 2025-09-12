import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venue, CreateVenueRequest } from '../models/models/venue.model';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private apiUrl = 'http://localhost:5000/api/venues';

  constructor(private http: HttpClient) {}

  getVenues(page = 1, limit = 10, city?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (city) {
      params = params.set('city', city);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getVenueById(id: string): Observable<Venue> {
    return this.http.get<Venue>(`${this.apiUrl}/${id}`);
  }

  createVenue(venueData: CreateVenueRequest): Observable<Venue> {
    return this.http.post<Venue>(this.apiUrl, venueData);
  }

  updateVenue(id: string, venueData: Partial<CreateVenueRequest>): Observable<Venue> {
    return this.http.put<Venue>(`${this.apiUrl}/${id}`, venueData);
  }

  deleteVenue(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMyVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(`${this.apiUrl}/my-venues`);
  }

  approveVenue(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/approve`, {});
  }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cities`);
  }
}