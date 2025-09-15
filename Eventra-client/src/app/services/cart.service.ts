import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart'; // ✨ غيّري البورت لو backend عندك مختلف

  constructor(private http: HttpClient) {}

  getCart(userID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userID}`);
  }

  addToCart(payload: { userID: string; eventID: string; quantity: number; price: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, payload);
  }

  updateQuantity(payload: { userID: string; eventID: string; quantity: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, payload);
  }

  removeFromCart(payload: { userID: string; eventID: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove`, payload);
  }

  emptyCart(payload: { userID: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/empty`, payload);
  }

  checkout(payload: { userID: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, payload);
  }
}
