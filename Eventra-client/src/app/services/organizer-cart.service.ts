import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizerCartService {
  private orgCartApi = 'http://localhost:5000/api/orgCart';

  constructor(private http: HttpClient) {}

  getCartByOrgId(id: string): Observable<any> {
    return this.http.get(`${this.orgCartApi}/${id}`);
  }
  AddItemToCart(item: any): Observable<any> {
    return this.http.post(this.orgCartApi, item);
  }
  deleteCart(orgId: string): Observable<any> {
    return this.http.delete(`${this.orgCartApi}/${orgId}`);
  }
  deleteItemFromCart(data: any): Observable<any> {
    return this.http.request('DELETE', this.orgCartApi, { body: data });
  }
}
