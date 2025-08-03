export interface Admin {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional for security
  createdAt: Date;
  token?: string; // For authentication
}

export interface AdminLogin {
  email: string;
  password: string;
}

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  lastLoginAt?: Date;
  permissions?: string[];
}

export interface DashboardStats {
  totalUsers: number;
  totalMechanics: number;
  approvedMechanics: number;
  pendingMechanics: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalReports: number;
  pendingReports: number;
  todayBookings?: number;
  monthlyRevenue?: number;
}
