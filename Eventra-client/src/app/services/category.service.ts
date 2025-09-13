import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/models/category.model';
@Injectable({ providedIn: 'root' })
export class CategoryService {
<<<<<<< HEAD
  
  private apiUrl = 'http://localhost:5000/api/categories';
=======
  private api = 'http://localhost:5000/api/categories';
>>>>>>> frontend/feature/evet-category

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.api, category);
  }

  update(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.api}/${id}`, category);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.api}/${id}`);
  }
}
