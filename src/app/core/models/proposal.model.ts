export interface Proposal {
  id: number;
  projectName: string;
  teamName: string;
  members: string[]; // comma separated or array
  department: string;
  proposedSupervisor: string;
  idea: string;
  goals: string;
  description: string;
  tools: string[];
  notes?: string;
  attachment?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'New' | 'Reviewed' | 'Accepted';
  submissionDate: Date | string;
  files?: string[];
}
