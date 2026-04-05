import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { Template } from '../models/template.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = environment.apiUrl + '/templates';

  constructor(private http: HttpClient) { }

  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  getVisibleTemplates(): Observable<Template[]> {
    return this.getTemplates().pipe(
      map(templates => templates.filter(t => t.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)))
    );
  }

  getTemplateById(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }

  addTemplate(template: Template): Observable<Template> {
    return this.http.post<Template>(this.apiUrl, template);
  }

  updateTemplate(id: number, data: Partial<Template>): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/${id}`, data);
  }

  deleteTemplate(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleVisibility(id: number): Observable<Template> {
    return this.http.patch<Template>(`${this.apiUrl}/${id}/toggle-visibility`, {});
  }
}
