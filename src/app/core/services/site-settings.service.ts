import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private apiUrl = environment.apiUrl + '/site-settings';

  constructor(private http: HttpClient) { }

  getSetting(key: string): Observable<{ key: string, value: string }> {
    return this.http.get<{ key: string, value: string }>(`${this.apiUrl}/${key}`);
  }
}
