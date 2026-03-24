import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContactMessage } from '../models/contact-message.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private mockMessages: ContactMessage[] = [
    {
      id: 1,
      name: 'علي حسن',
      email: 'ali.hassan@must.edu.eg',
      subject: 'استفسار عن موعد التخرج',
      message: 'متى سيتم إعلان موعد حفل التخرج؟',
      status: 'New',
      submissionDate: new Date(Date.now() - 1000 * 60 * 60 * 24)
    }
  ];

  constructor() { }

  getMessages(): Observable<ContactMessage[]> {
    return of(this.mockMessages);
  }

  addMessage(message: Omit<ContactMessage, 'id' | 'status' | 'submissionDate'>): Observable<ContactMessage> {
    const newMessage: ContactMessage = {
      ...message,
      id: Date.now(),
      status: 'New',
      submissionDate: new Date()
    };
    this.mockMessages.push(newMessage);
    return of(newMessage);
  }

  updateMessageStatus(id: number, status: ContactMessage['status']): Observable<ContactMessage | undefined> {
    const message = this.mockMessages.find(m => m.id === id);
    if (message) {
      message.status = status;
      return of(message);
    }
    return of(undefined);
  }

  deleteMessage(id: number): Observable<boolean> {
    const index = this.mockMessages.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mockMessages.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
