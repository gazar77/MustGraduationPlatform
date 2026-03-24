export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  submissionDate: Date | string;
}
