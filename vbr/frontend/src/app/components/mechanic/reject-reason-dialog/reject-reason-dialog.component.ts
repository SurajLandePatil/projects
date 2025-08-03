// import { Component } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';

// @Component({
//   selector: 'app-reject-reason-dialog',
//   template: `
//     <h2 mat-dialog-title>Reject Booking</h2>
//     <mat-dialog-content>
//       <mat-form-field style="width:100%">
//         <mat-label>Reason for rejection</mat-label>
//         <input matInput [(ngModel)]="reason" maxlength="120" />
//       </mat-form-field>
//     </mat-dialog-content>
//     <mat-dialog-actions align="end">
//       <button mat-button (click)="onCancel()">Cancel</button>
//       <button mat-raised-button color="warn" (click)="onSubmit()" [disabled]="!reason.trim()">Reject</button>
//     </mat-dialog-actions>
//   `
// })
// export class RejectReasonDialogComponent {
//   reason = '';
//   constructor(private dialogRef: MatDialogRef<RejectReasonDialogComponent>) {}
//   onCancel() { this.dialogRef.close(); }
//   onSubmit() { this.dialogRef.close(this.reason); }
// }
// src/app/components/mechanic/reject-reason-dialog.component.ts

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  template: `
    <h2 mat-dialog-title>Reject Booking</h2>
    <mat-dialog-content>
      <mat-form-field style="width:100%">
        <mat-label>Reason for rejection</mat-label>
        <input matInput [(ngModel)]="reason" maxlength="120" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onSubmit()" [disabled]="!reason.trim()">Reject</button>
    </mat-dialog-actions>
  `
})
export class RejectReasonDialogComponent {
  reason = '';
  constructor(private dialogRef: MatDialogRef<RejectReasonDialogComponent>) {}
  onCancel() { this.dialogRef.close(); }
  onSubmit() { this.dialogRef.close(this.reason); }
}
