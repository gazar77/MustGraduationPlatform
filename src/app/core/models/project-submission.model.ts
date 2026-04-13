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
  /** Public path under the API host, e.g. /uploads/... (prefix API origin when SPA is on another domain). */
  fileUrl?: string | null;
  notes: string;
  registrationPayloadJson?: string | null;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  submissionDate: Date | string;
}
