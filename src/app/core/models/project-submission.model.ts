export interface ProjectSubmission {
  id: number;
  type: 'project1' | 'project2';
  studentName?: string;
  email?: string;
  fileName: string;
  notes: string;
  status: 'New' | 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  submissionDate: Date | string;
}
