import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GraduationTeamMember {
  studentId: string;
  name: string;
  department: string;
}

export interface GraduationProject {
  title: string;
  department: string;
  supervisorName: string;
  students: GraduationTeamMember[];
}

export interface GraduationRequirementFile {
  id: number;
  requirementKey: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class GraduationService {
  private apiUrl = environment.apiUrl + '/graduation';

  constructor(private http: HttpClient) {}

  getMyProject(): Observable<GraduationProject> {
    return this.http.get<GraduationProject>(`${this.apiUrl}/my-project`);
  }

  getMyRequirementFiles(): Observable<GraduationRequirementFile[]> {
    return this.http.get<GraduationRequirementFile[]>(`${this.apiUrl}/requirements/my`);
  }

  uploadRequirement(requirementKey: string, file: File): Observable<GraduationRequirementFile> {
    const fd = new FormData();
    fd.append('requirementKey', requirementKey);
    fd.append('file', file, file.name);
    return this.http.post<GraduationRequirementFile>(`${this.apiUrl}/requirements/upload`, fd);
  }
}
