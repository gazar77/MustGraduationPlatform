import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { TutorialDocument } from '../models/tutorial-document.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TutorialDocumentService {
  private apiUrl = environment.apiUrl + '/tutorials';

  constructor(private http: HttpClient) {}

  getTutorialDocuments(): Observable<TutorialDocument[]> {
    return this.http.get<TutorialDocument[]>(this.apiUrl).pipe(catchError(() => of([])));
  }

  getAllForManage(): Observable<TutorialDocument[]> {
    return this.http.get<TutorialDocument[]>(`${this.apiUrl}/manage`).pipe(catchError(() => of([])));
  }

  /** Create metadata-only row (no file); prefer addTutorialWithFile for real uploads. */
  addTutorial(meta: {
    title: string;
    description: string;
    fileUrl: string;
    fileSize: string;
    isVisible: boolean;
    displayOrder: number;
  }): Observable<TutorialDocument> {
    return this.http.post<TutorialDocument>(this.apiUrl, meta);
  }

  addTutorialWithFile(
    file: File,
    meta: { title: string; description: string; isVisible: boolean; displayOrder: number }
  ): Observable<TutorialDocument> {
    const fd = new FormData();
    fd.append('title', meta.title);
    fd.append('description', meta.description);
    fd.append('isVisible', String(meta.isVisible));
    fd.append('displayOrder', String(meta.displayOrder));
    fd.append('file', file, file.name);
    return this.http.post<TutorialDocument>(`${this.apiUrl}/with-file`, fd);
  }

  updateTutorial(
    id: number,
    data: {
      title: string;
      description: string;
      fileUrl: string;
      fileSize: string;
      isVisible: boolean;
      displayOrder: number;
    }
  ): Observable<TutorialDocument> {
    return this.http.put<TutorialDocument>(`${this.apiUrl}/${id}`, data);
  }

  updateTutorialWithFile(
    id: number,
    file: File,
    meta: { title: string; description: string; isVisible: boolean; displayOrder: number }
  ): Observable<TutorialDocument> {
    const fd = new FormData();
    fd.append('title', meta.title);
    fd.append('description', meta.description);
    fd.append('isVisible', String(meta.isVisible));
    fd.append('displayOrder', String(meta.displayOrder));
    fd.append('file', file, file.name);
    return this.http.put<TutorialDocument>(`${this.apiUrl}/${id}/with-file`, fd);
  }

  deleteTutorial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleVisibility(id: number): Observable<TutorialDocument> {
    return this.http.post<TutorialDocument>(`${this.apiUrl}/${id}/toggle-visibility`, {});
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }
}
