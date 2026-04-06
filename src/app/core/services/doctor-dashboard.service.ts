import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Idea } from '../models/idea.model';

export interface DoctorDashboard {
  supervisedIdeasCount: number;
  pendingProposalsCount: number;
  ideas: Idea[];
}

@Injectable({
  providedIn: 'root'
})
export class DoctorDashboardService {
  private apiUrl = environment.apiUrl + '/doctor';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DoctorDashboard> {
    return this.http.get<DoctorDashboard>(`${this.apiUrl}/dashboard`);
  }
}
