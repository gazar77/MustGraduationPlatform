import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { ProjectSubmission } from '../models/project-submission.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectSubmissionService {
  private apiUrl = environment.apiUrl + '/project-submissions';

  constructor(private http: HttpClient) { }

  getSubmissions(type?: 'proposal' | 'project1' | 'project2'): Observable<ProjectSubmission[]> {
    const url = type ? `${this.apiUrl}?type=${type}` : this.apiUrl;
    return this.http.get<ProjectSubmission[]>(url).pipe(
      catchError(() => of([]))
    );
  }

  addSubmission(submission: Omit<ProjectSubmission, 'id' | 'status' | 'submissionDate' | 'fileUrl'>): Observable<ProjectSubmission> {
    return this.http.post<ProjectSubmission>(this.apiUrl, submission);
  }

  /** Multipart upload; API saves the file under wwwroot/uploads and returns fileUrl. */
  addSubmissionWithFile(formData: FormData): Observable<ProjectSubmission> {
    return this.http.post<ProjectSubmission>(`${this.apiUrl}/with-file`, formData);
  }

  updateStatus(id: number, status: ProjectSubmission['status']): Observable<ProjectSubmission> {
    return this.http.patch<ProjectSubmission>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteSubmission(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
