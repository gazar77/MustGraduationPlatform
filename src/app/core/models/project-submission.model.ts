export interface ProjectSubmission {
  id: number;
  type: 'proposal' | 'project1' | 'project2';
  studentName?: string;
  email?: string;
  projectNumber?: string;
  projectTitle?: string;
  supervisorName?: string;
  teamLeaderName?: string;
  fileName: string;
  notes: string;
  status: 'New' | 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  submissionDate: Date | string;
}
