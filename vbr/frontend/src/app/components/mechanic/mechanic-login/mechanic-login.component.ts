import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MechanicService } from '../../../services/mechanic.service';

@Component({
  selector: 'app-mechanic-login',
  templateUrl: './mechanic-login.component.html',
  styleUrls: ['./mechanic-login.component.css']
})
export class MechanicLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private mechanicService: MechanicService,
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
      this.mechanicService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open('Login successful!', 'Close', {
              duration: 2000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/mechanic/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error?.message || 'Login failed. Please check your credentials or approval status.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/mechanic/register']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
