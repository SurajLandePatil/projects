import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mechanic } from '../../../models/mechanic.model'; // Adjust path if needed
//import { Mechanic } from 'src/app/models/mechanic.model'; // Correct your path!

@Component({
  selector: 'app-mechanic-detail-dialog',
  templateUrl: './mechanic-detail-dialog.component.html',
  styleUrls: ['./mechanic-detail-dialog.component.css']
})
export class MechanicDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MechanicDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Mechanic
  ) {}
}
