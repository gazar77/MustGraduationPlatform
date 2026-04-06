import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { Event } from '../models/event.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  /** Admin: full list including hidden (requires auth cookie). */
  getAllForManage(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/manage`).pipe(
      catchError(() => of([]))
    );
  }

  getVisibleEvents(): Observable<Event[]> {
    return this.getEvents().pipe(
      map(events => events.filter(e => e.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)))
    );
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(id: number, data: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, data);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleVisibility(id: number): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}/toggle-visibility`, {});
  }
}
