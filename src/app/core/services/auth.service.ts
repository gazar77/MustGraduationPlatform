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
    this.checkAuthentication();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private checkAuthentication(): void {
    // The backend uses HttpOnly cookies, so we can't check the token directly.
    // Instead, we call an "identify" or "me" endpoint on startup.
    this.identify().subscribe();
  }

  identify(): Observable<{ exists: boolean; userType: string | null }> {
    return this.http.post<{ exists: boolean; userType: string | null }>(`${this.apiUrl}/identify`, {}).pipe(
      tap(res => {
        if (!res.exists) {
          this.currentUserSubject.next(null);
        }
      }),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of({ exists: false, userType: null });
      })
    );
  }

  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/login`, { email, password }).pipe(
      tap(res => {
        // Backend sets HttpOnly cookie access_token. 
        // We might need to fetch the user profile if the login response doesn't include it.
        this.fetchCurrentUser().subscribe();
      })
    );
  }

  studentSendCode(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/student/send-code`, { email });
  }

  studentLogin(email: string, code: string, password?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/student/login`, { email, code, password }).pipe(
      tap(() => this.fetchCurrentUser().subscribe())
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
    // Assuming there's a profile or me endpoint. If not, we use identity.
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }
}
