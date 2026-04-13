export interface SubmissionAttachment {
  fileName: string;
  fileUrl: string;
}

export interface ProjectSubmission {
  id: number;
  type: 'proposal' | 'idea_registration' | 'project1' | 'project2';
  studentName?: string;
  email?: string;
  projectNumber?: string;
  projectTitle?: string;
  supervisorName?: string;
  teamLeaderName?: string;
  fileName: string;
  /** Public path under the API host, e.g. /uploads/... (prefix API origin when SPA is on another domain). */
  fileUrl?: string | null;
  /** Present when multiple files were uploaded (project registration 1/2). */
  attachments?: SubmissionAttachment[] | null;
  notes: string;
  registrationPayloadJson?: string | null;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  submissionDate: Date | string;
}
