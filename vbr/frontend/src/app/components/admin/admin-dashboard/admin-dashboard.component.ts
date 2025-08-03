import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  dashboardStats: any = {};
  isLoading = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  navigateToUserList(): void {
  this.router.navigate(['/admin/users']);
}


  loadDashboardStats(): void {
    this.isLoading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load dashboard stats', 'Close', { duration: 3000 });
      }
    });
  }

  navigateToMechanicApproval(): void {
    this.router.navigate(['/admin/mechanic-approval']);
  }

  navigateToReportManagement(): void {
    this.router.navigate(['/admin/report-management']);
  }

  logout(): void {
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('userType');
    this.router.navigate(['/']);
  }
}
