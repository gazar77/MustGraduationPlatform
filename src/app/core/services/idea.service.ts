import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { Idea } from '../models/idea.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private apiUrl = environment.apiUrl + '/ideas';

  constructor(private http: HttpClient) { }

  getIdeas(): Observable<Idea[]> {
    return this.http.get<Idea[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  /** Admin: full list including hidden (requires auth cookie). */
  getAllForManage(): Observable<Idea[]> {
    return this.http.get<Idea[]>(`${this.apiUrl}/manage`).pipe(
      catchError(() => of([]))
    );
  }

  /** Admin (faculty): ideas where API matches current user's name to supervisor (auth cookie). */
  getIdeasForMe(): Observable<Idea[]> {
    return this.http.get<Idea[]>(`${this.apiUrl}/for-me`).pipe(
      catchError(() => of([]))
    );
  }

  getVisibleIdeas(): Observable<Idea[]> {
    // Backend should ideally handle 'visible' filtering, but if not we can filter here
    return this.getIdeas().pipe(
      map(ideas => ideas.filter(i => i.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)))
    );
  }

  getIdeaById(id: number): Observable<Idea> {
    return this.http.get<Idea>(`${this.apiUrl}/${id}`);
  }

  addIdea(idea: Idea): Observable<Idea> {
    return this.http.post<Idea>(this.apiUrl, idea);
  }

  /** Student/Admin: submit a new idea for review (hidden until admin publishes). */
  submitStudentIdea(payload: {
    title: string;
    description: string;
    category: string;
    maxTeamSize: number;
    supervisorName: string;
  }): Observable<Idea> {
    return this.http.post<Idea>(`${this.apiUrl}/student-submit`, payload);
  }

  updateIdea(id: number, data: Partial<Idea>): Observable<Idea> {
    return this.http.put<Idea>(`${this.apiUrl}/${id}`, data);
  }

  /** Student/Admin: reserve an open idea (server enforces site setting + idea status). */
  reserveIdea(id: number): Observable<Idea> {
    return this.http.post<Idea>(`${this.apiUrl}/${id}/reserve`, {});
  }

  deleteIdea(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleVisibility(id: number): Observable<Idea> {
    return this.http.patch<Idea>(`${this.apiUrl}/${id}/toggle-visibility`, {});
  }
}
