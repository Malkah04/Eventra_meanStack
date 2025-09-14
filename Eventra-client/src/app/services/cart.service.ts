import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getCart(userID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userID}`, { headers: this.getAuthHeaders() });
  }

  // ❌ price اتشال هنا — الـ backend بيجيبه من DB
  addToCart(data: { userID: string, eventID: string, quantity: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data, { headers: this.getAuthHeaders() });
  }

  removeFromCart(data: { userID: string, eventID: string }): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/remove`, { body: data, headers: this.getAuthHeaders() });
  }

  emptyCart(userID: string): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/empty`, { body: { userID }, headers: this.getAuthHeaders() });
  }

  // ✅ update quantity
  updateQuantity(data: { userID: string, eventID: string, quantity: number }): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, data, { headers: this.getAuthHeaders() });
  }
}