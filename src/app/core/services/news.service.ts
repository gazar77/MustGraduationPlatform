import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { News } from '../models/news.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = environment.apiUrl + '/news';

  constructor(private http: HttpClient) { }

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  /** Admin: full list including hidden (requires auth cookie). */
  getAllForManage(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/manage`).pipe(
      catchError(() => of([]))
    );
  }

  getVisibleNews(): Observable<News[]> {
    return this.getNews().pipe(
      map(news => news.filter(n => n.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)))
    );
  }

  getNewsById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`);
  }

  addNews(news: News): Observable<News> {
    return this.http.post<News>(this.apiUrl, news);
  }

  /** Admin: multipart; form keys must match `NewsFormModel` (binding is case-insensitive). */
  addNewsWithImage(formData: FormData): Observable<News> {
    return this.http.post<News>(`${this.apiUrl}/with-image`, formData);
  }

  updateNews(id: number, data: Partial<News>): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${id}`, data);
  }

  updateNewsWithImage(id: number, formData: FormData): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${id}/with-image`, formData);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleVisibility(id: number): Observable<News> {
    return this.http.patch<News>(`${this.apiUrl}/${id}/toggle-visibility`, {});
  }
}
