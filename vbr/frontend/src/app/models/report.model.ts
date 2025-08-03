export interface Report {
  id: number;
  userId: number;
  mechanicId: number;
  bookingId?: number;
  reason: string;
  description: string;
  status: ReportStatus;
  createdAt: Date;
  resolvedAt?: Date;
  
  // Extended fields for UI
  userName?: string;
  mechanicName?: string;
  adminNotes?: string;
  evidenceFiles?: string[];
  severity?: ReportSeverity;
  category?: ReportCategory;
}

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export enum ReportSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ReportCategory {
  QUALITY = 'QUALITY',
  BEHAVIOR = 'BEHAVIOR',
  PRICING = 'PRICING',
  FRAUD = 'FRAUD',
  SAFETY = 'SAFETY',
  OTHER = 'OTHER'
}

export interface ReportRequest {
  userId: number;
  mechanicId: number;
  bookingId?: number;
  reason: string;
  description: string;
  category: ReportCategory;
  severity?: ReportSeverity;
  evidenceFiles?: File[];
}

export interface ReportResponse {
  report: Report;
  confirmationNumber: string;
  expectedResolution?: Date;
}

export interface ReportSummary {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  reportsByCategory: { [key in ReportCategory]: number };
  reportsBySeverity: { [key in ReportSeverity]: number };
  averageResolutionTime: number; // in hours
}

export interface ReportDetail extends Report {
  timeline: ReportTimeline[];
  relatedReports?: Report[];
  actions?: ReportAction[];
}

export interface ReportTimeline {
  id: number;
  action: string;
  description: string;
  performedBy: string;
  performedAt: Date;
  metadata?: any;
}

export interface ReportAction {
  id: string;
  name: string;
  description: string;
  requiresConfirmation: boolean;
  severity: 'info' | 'warning' | 'danger';
}

export interface ReportFilter {
  status?: ReportStatus[];
  category?: ReportCategory[];
  severity?: ReportSeverity[];
  dateFrom?: Date;
  dateTo?: Date;
  mechanicId?: number;
  userId?: number;
}

export interface ReportResolution {
  reportId: number;
  action: 'RESOLVE' | 'DISMISS' | 'ESCALATE';
  adminNotes: string;
  actionTaken?: string;
  followUpRequired?: boolean;
  notifyReporter?: boolean;
}

export interface MechanicReportStats {
  mechanicId: number;
  totalReports: number;
  reportsByCategory: { [key in ReportCategory]: number };
  averageRating: number;
  recentReports: Report[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  actionRequired: boolean;
}
