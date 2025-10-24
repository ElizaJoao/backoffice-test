export interface Statistics {
  totalUsers: number;
  totalCompanies: number;
  pendingApprovals: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
  recentActivity: {
    date: string;
    count: number;
  }[];
  approvalsByStatus: {
    status: string;
    count: number;
  }[];
}
