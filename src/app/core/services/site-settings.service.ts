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

  /** Admin: all key/value pairs. */
  getAll(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(this.apiUrl);
  }

  /** Admin: create or update a setting value (raw string as stored in DB). */
  upsert(key: string, value: string): Observable<{ key: string; value: string }> {
    return this.http.put<{ key: string; value: string }>(`${this.apiUrl}/${encodeURIComponent(key)}`, { value });
  }

  /** DB may store JSON-encoded strings (e.g. `"2026-04-30T23:59:59Z"`). */
  parseStoredValue(raw: string): string {
    if (raw == null || raw === '') {
      return '';
    }
    try {
      const v = JSON.parse(raw);
      return typeof v === 'string' ? v : raw;
    } catch {
      return raw;
    }
  }
}
