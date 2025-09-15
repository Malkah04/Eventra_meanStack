import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizerCartService {
  private orgCartApi = 'http://localhost:5000/api/orgCart';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getCartByOrgId(id: string): Observable<any> {
    return this.http.get(`${this.orgCartApi}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  AddItemToCart(item: any): Observable<any> {
    return this.http.post(this.orgCartApi, item, {
      headers: this.getAuthHeaders(),
    });
  }
  deleteCart(orgId: string): Observable<any> {
    return this.http.delete(`${this.orgCartApi}/${orgId}`, {
      headers: this.getAuthHeaders(),
    });
  }
  deleteItemFromCart(data: any): Observable<any> {
    return this.http.request('DELETE', this.orgCartApi, {
      headers: this.getAuthHeaders(),
      body: data,
    });
  }
}
