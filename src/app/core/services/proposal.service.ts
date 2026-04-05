import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Proposal } from '../models/proposal.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private apiUrl = environment.apiUrl + '/proposals';

  constructor(private http: HttpClient) { }

  getProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  getProposalById(id: number): Observable<Proposal> {
    return this.http.get<Proposal>(`${this.apiUrl}/${id}`);
  }

  updateProposalStatus(id: number, status: Proposal['status']): Observable<Proposal> {
    return this.http.patch<Proposal>(`${this.apiUrl}/${id}/status`, { status });
  }

  addProposal(proposal: Omit<Proposal, 'id' | 'status' | 'submissionDate'>): Observable<Proposal> {
    return this.http.post<Proposal>(this.apiUrl, proposal);
  }

  deleteProposal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
