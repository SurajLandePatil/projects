import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../../services/admin.service';
import { Report } from '../../../models/report.model';

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.css']
})
export class ReportManagementComponent implements OnInit {
  allReports: Report[] = [];
  pendingReports: Report[] = [];
  resolvedReports: Report[] = [];
  isLoading = false;
  selectedTab = 0;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllReports();
    this.loadPendingReports();
  }

  loadAllReports(): void {
    this.isLoading = true;
    this.adminService.getAllReports().subscribe({
      next: (reports) => {
        this.allReports = reports;
        this.resolvedReports = reports.filter(r => r.status === 'RESOLVED' || r.status === 'DISMISSED');
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load reports', 'Close', { duration: 3000 });
      }
    });
  }

  loadPendingReports(): void {
    this.adminService.getPendingReports().subscribe({
      next: (reports) => {
        this.pendingReports = reports;
      },
      error: (error) => {
        this.snackBar.open('Failed to load pending reports', 'Close', { duration: 3000 });
      }
    });
  }

  resolveReport(reportId: number): void {
    this.adminService.resolveReport(reportId, { action: 'resolve' }).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Report resolved successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadAllReports();
          this.loadPendingReports();
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to resolve report', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  dismissReport(reportId: number): void {
    this.adminService.resolveReport(reportId, { action: 'dismiss' }).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Report dismissed successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadAllReports();
          this.loadPendingReports();
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to dismiss report', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return '#ff9800';
      case 'UNDER_REVIEW': return '#2196f3';
      case 'RESOLVED': return '#4caf50';
      case 'DISMISSED': return '#9e9e9e';
      default: return '#666';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING': return 'schedule';
      case 'UNDER_REVIEW': return 'visibility';
      case 'RESOLVED': return 'check_circle';
      case 'DISMISSED': return 'cancel';
      default: return 'help';
    }
  }

  getSeverityColor(reason: string): string {
    const highSeverityReasons = ['fraud', 'scam', 'dangerous', 'threat'];
    const mediumSeverityReasons = ['overcharging', 'poor service', 'unprofessional'];
    
    const lowerReason = reason.toLowerCase();
    if (highSeverityReasons.some(r => lowerReason.includes(r))) {
      return '#f44336'; // Red
    } else if (mediumSeverityReasons.some(r => lowerReason.includes(r))) {
      return '#ff9800'; // Orange
    }
    return '#2196f3'; // Blue
  }
}
