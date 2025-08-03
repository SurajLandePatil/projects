import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../../services/admin.service';
import { MechanicService } from '../../../services/mechanic.service';
import { Mechanic } from '../../../models/mechanic.model';
//import { MechanicDetailDialogComponent } from './components/admin/mechanic-detail-dialog/mechanic-detail-dialog.component';
import { MechanicDetailDialogComponent } from '../mechanic-detail-dialog/mechanic-detail-dialog.component';


@Component({
  selector: 'app-mechanic-approval',
  templateUrl: './mechanic-approval.component.html',
  styleUrls: ['./mechanic-approval.component.css']
})
export class MechanicApprovalComponent implements OnInit {
  pendingMechanics: Mechanic[] = [];
  approvedMechanics: Mechanic[] = [];
  isLoading = false;
  selectedTab = 0;

  constructor(
    private adminService: AdminService,
    private mechanicService: MechanicService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPendingMechanics();
    this.loadApprovedMechanics();
  }

  loadPendingMechanics(): void {
    this.isLoading = true;
    this.adminService.getPendingMechanics().subscribe({
      next: (mechanics) => {
        this.pendingMechanics = mechanics;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load pending mechanics', 'Close', { duration: 3000 });
      }
    });
  }

  loadApprovedMechanics(): void {
    this.adminService.getApprovedMechanics().subscribe({
      next: (mechanics) => {
        this.approvedMechanics = mechanics;
      },
      error: (error) => {
        this.snackBar.open('Failed to load approved mechanics', 'Close', { duration: 3000 });
      }
    });
  }

  approveMechanic(mechanicId: number): void {
    this.adminService.approveMechanic(mechanicId).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Mechanic approved successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadPendingMechanics();
          this.loadApprovedMechanics();
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to approve mechanic', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  rejectMechanic(mechanicId: number): void {
    this.adminService.rejectMechanic(mechanicId).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Mechanic rejected successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadPendingMechanics();
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to reject mechanic', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  viewMechanicDetails(mechanic: Mechanic): void {
  this.dialog.open(MechanicDetailDialogComponent, {
    width: '400px',
    data: mechanic
  });
  console.log('Mechanic details:', mechanic); // <-- outside the options object
}


  formatSpecializations(specialization: string): string[] {
    return specialization ? specialization.split(',').map(s => s.trim()) : [];
  }
}
