import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewApi = 'http://localhost:5000/api/review';
  constructor(private http: HttpClient) {}

  getCommentOfPostId(id: string): Observable<any> {
    return this.http.get<any>(`${this.reviewApi}/${id}`);
  }

  addComment(item: any): Observable<any> {
    return this.http.post(this.reviewApi, item);
  }
  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.reviewApi}/${id}`);
  }
  updateComment(id: string, comment: string): Observable<any> {
    return this.http.put<any>(`${this.reviewApi}/${id}`, { comment });
  }
}
