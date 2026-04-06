import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentCode: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserListItem[]> {
    return this.http.get<UserListItem[]>(this.apiUrl);
  }
}
