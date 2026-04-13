import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IdeaCategory {
  id: number;
  name: string;
  sortOrder: number;
}

@Injectable({ providedIn: 'root' })
export class IdeaCategoryService {
  private apiUrl = environment.apiUrl + '/idea-categories';

  constructor(private http: HttpClient) {}

  getVisible(): Observable<IdeaCategory[]> {
    return this.http.get<IdeaCategory[]>(this.apiUrl);
  }

  getAllForManage(): Observable<IdeaCategory[]> {
    return this.http.get<IdeaCategory[]>(`${this.apiUrl}/manage`);
  }

  create(body: { name: string; sortOrder: number }): Observable<IdeaCategory> {
    return this.http.post<IdeaCategory>(this.apiUrl, body);
  }

  update(id: number, body: { name: string; sortOrder: number }): Observable<IdeaCategory> {
    return this.http.put<IdeaCategory>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
