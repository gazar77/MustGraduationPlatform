export interface DashboardStats {
  totalIdeas: number;
  reservedIdeas: number;
  approvedIdeas: number;
  totalDoctors: number;
  totalProposals: number;
  visibleContentCount: number;
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: Date | string;
  user: string;
}
