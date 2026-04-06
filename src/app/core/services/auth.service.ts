import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshSession().subscribe();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /** Restore user from HttpOnly cookie via GET /auth/me */
  refreshSession(): Observable<User | null> {
    return this.fetchCurrentUser();
  }

  /** Do not swallow HTTP/network errors — callers must show server-unreachable vs not-registered. */
  identify(email: string): Observable<{ exists: boolean; userType: string | null }> {
    return this.http.post<{ exists: boolean; userType: string | null }>(`${this.apiUrl}/identify`, { email });
  }

  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/login`, { email, password }).pipe(
      tap(res => {
        if (res?.user) {
          this.currentUserSubject.next(this.mapUser(res.user));
        }
      })
    );
  }

  studentSendCode(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/student/send-code`, { email });
  }

  studentLogin(email: string, code: string, password?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/student/login`, { email, code, password }).pipe(
      tap(res => {
        if (res?.user) {
          this.currentUserSubject.next(this.mapUser(res.user));
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/departments`);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  private fetchCurrentUser(): Observable<User | null> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      map(dto => this.mapUser(dto)),
      tap(user => this.currentUserSubject.next(user)),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  private mapUser(dto: any): User {
    const role = dto?.role === 'Admin' ? 'Admin' : 'Student';
    return {
      id: String(dto.id),
      name: dto.name ?? '',
      email: dto.email ?? '',
      role,
      departmentCode: dto.departmentCode ?? null
    };
  }
}
