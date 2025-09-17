import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venue, CreateVenueRequest } from '../models/models/venue.model';
import { Category } from '../models/models/category.model';
import { map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VenueService {
  private apiUrl = 'http://localhost:5000/api/venues';
  private categoriesUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) {}

  getVenues(page = 1, limit = 10, categoryId?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getMyVenuesByOwner(categoryId?: string): Observable<any> {
    let params = new HttpParams();

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<any>(`${this.apiUrl}/my`, { params });
  }

  getVenueById(
    id: string
  ): Observable<{ message: string; data: { venue: Venue } }> {
    return this.http.get<{ message: string; data: { venue: Venue } }>(
      `${this.apiUrl}/${id}`
    );
  }

  getVenue(id: string) {
    return this.http.get<{ message: string; data: { venue: any } }>(
      `${this.apiUrl}/${id}`
    );
  }

  createVenue(venue: any) {
    return this.http.post<{ message: string; data: any }>(
      `${this.apiUrl}`,
      venue
    );
  }

  updateVenue(
    id: string,
    venueData: Partial<CreateVenueRequest>
  ): Observable<Venue> {
    return this.http.patch<Venue>(`${this.apiUrl}/${id}`, venueData);
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

  getCategories(): Observable<Category[]> {
    return this.http
      .get<{ message: string; data: { categories: Category[] } }>(
        this.categoriesUrl
      )
      .pipe(
        map(
          (response: { message: string; data: { categories: Category[] } }) =>
            response.data.categories
        )
      );
  }

  search(searchItem: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/${searchItem}`);
  }

  filter(query: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter`, { params: query });
  }
}
