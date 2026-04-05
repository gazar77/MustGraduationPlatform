import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessage } from '../models/contact-message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl + '/contact';

  constructor(private http: HttpClient) { }

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl);
  }

  addMessage(message: Omit<ContactMessage, 'id' | 'status' | 'submissionDate'>): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(this.apiUrl, message);
  }

  updateMessageStatus(id: number, status: ContactMessage['status']): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
