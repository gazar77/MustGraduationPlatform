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

  /** Admin: full list including hidden (requires auth cookie). */
  getAllForManage(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.apiUrl}/manage`).pipe(
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

  /** Admin: multipart upload; stores file under wwwroot/uploads and sets fileUrl. */
  addTemplateWithFile(
    file: File,
    meta: { title: string; description: string; isVisible: boolean; displayOrder: number }
  ): Observable<Template> {
    const fd = new FormData();
    fd.append('title', meta.title);
    fd.append('description', meta.description);
    fd.append('isVisible', String(meta.isVisible));
    fd.append('displayOrder', String(meta.displayOrder));
    fd.append('file', file, file.name);
    return this.http.post<Template>(`${this.apiUrl}/with-file`, fd);
  }

  updateTemplate(id: number, data: Partial<Template>): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/${id}`, data);
  }

  updateTemplateWithFile(
    id: number,
    file: File,
    meta: { title: string; description: string; isVisible: boolean; displayOrder: number }
  ): Observable<Template> {
    const fd = new FormData();
    fd.append('title', meta.title);
    fd.append('description', meta.description);
    fd.append('isVisible', String(meta.isVisible));
    fd.append('displayOrder', String(meta.displayOrder));
    fd.append('file', file, file.name);
    return this.http.put<Template>(`${this.apiUrl}/${id}/with-file`, fd);
  }

  deleteTemplate(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleVisibility(id: number): Observable<Template> {
    return this.http.post<Template>(`${this.apiUrl}/${id}/toggle-visibility`, {});
  }

  /** Binary stream with Content-Disposition from API — use for reliable downloads from the SPA (CORS). */
  downloadTemplateFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }
}
