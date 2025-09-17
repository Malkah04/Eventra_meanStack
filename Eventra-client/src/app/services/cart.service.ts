import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface for Cart Item
interface CartItem {
  eventID: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Interface for Cart
interface Cart {
  userID: string;
  items: CartItem[];
  totalAmount: number;
  status: 'active' | 'checkedOut' | 'cleared';
}

// Interface for API Response
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }

  getCart(userID: string): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(
      `${this.apiUrl}/${userID}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  addToCart(payload: {
    userID: string;
    eventID: string;
    quantity: number;
    price: number
  }): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(
      `${this.apiUrl}/add`,
      payload,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateQuantity(payload: {
    userID: string;
    eventID: string;
    quantity: number
  }): Observable<ApiResponse<Cart>> {
    return this.http.put<ApiResponse<Cart>>(
      `${this.apiUrl}/update`,
      payload,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  removeFromCart(payload: {
    userID: string;
    eventID: string
  }): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(
      `${this.apiUrl}/remove`,
      {
        headers: this.getAuthHeaders(),
        body: payload
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  emptyCart(payload: {
    userID: string
  }): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(
      `${this.apiUrl}/empty`,
      {
        headers: this.getAuthHeaders(),
        body: payload
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  checkout(payload: {
    userID: string
  }): Observable<ApiResponse<{ url: string }>> {
    return this.http.post<ApiResponse<{ url: string }>>(
      `${this.apiUrl}/checkout`,
      payload,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
