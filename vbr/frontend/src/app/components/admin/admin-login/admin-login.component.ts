import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  


  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.adminService.loginAdmin(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              // Before setting currentAdmin and userType, clear others
              localStorage.removeItem('currentUser');
              localStorage.removeItem('currentMechanic');
              // localStorage.setItem('currentAdmin', JSON.stringify(response.admin));
              // localStorage.setItem('userType', 'admin');

              localStorage.setItem('currentAdmin', JSON.stringify(response.admin));
              localStorage.setItem('userType', 'admin');
              this.snackBar.open('Login successful!', 'Close', {
                duration: 2000,
                panelClass: ['success-snackbar']
              });
              this.router.navigate(['/admin/dashboard']);
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open(error.error?.message || 'Invalid credentials', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
