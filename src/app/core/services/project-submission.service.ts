import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProjectSubmission } from '../models/project-submission.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectSubmissionService {
  private mockSubmissions: ProjectSubmission[] = [
    {
      id: 1,
      type: 'project1',
      studentName: 'أحمد محمود',
      email: 'ahmed@must.edu.eg',
      fileName: 'Requirements_Document.pdf',
      notes: 'Please find attached the initial requirements for our project.',
      status: 'Reviewed',
      submissionDate: new Date(Date.now() - 1000 * 60 * 60 * 48)
    }
  ];

  constructor() { }

  getSubmissions(type?: 'project1' | 'project2'): Observable<ProjectSubmission[]> {
    if (type) {
      return of(this.mockSubmissions.filter(s => s.type === type));
    }
    return of(this.mockSubmissions);
  }

  addSubmission(submission: Omit<ProjectSubmission, 'id' | 'status' | 'submissionDate'>): Observable<ProjectSubmission> {
    const newSubmission: ProjectSubmission = {
      ...submission,
      id: Date.now(),
      status: 'Pending',
      submissionDate: new Date()
    };
    this.mockSubmissions.push(newSubmission);
    return of(newSubmission);
  }

  updateStatus(id: number, status: ProjectSubmission['status']): Observable<ProjectSubmission | undefined> {
    const sub = this.mockSubmissions.find(m => m.id === id);
    if (sub) {
      sub.status = status;
      return of(sub);
    }
    return of(undefined);
  }

  deleteSubmission(id: number): Observable<boolean> {
    const index = this.mockSubmissions.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mockSubmissions.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
