import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private paymentApi = 'http://localhost:5000/api/payment/checkout';

  constructor(private http: HttpClient) {}

  checkOut(cartId: string, userId: string, amount: number): Observable<any> {
    const body = { cartId, userId, amount };
    return this.http.post(this.paymentApi, body);
  }
}
