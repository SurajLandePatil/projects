import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MechanicService } from '../../../services/mechanic.service';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-mechanic-registration',
  templateUrl: './mechanic-registration.component.html',
  styleUrls: ['./mechanic-registration.component.css']
})
export class MechanicRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  currentLocation: { lat: number, lng: number } | null = null;
  gettingLocation = false;

  specializations = [
    'Car Engine',
    'Transmission',
    'Brakes',
    'AC Repair',
    'Electrical',
    'Suspension',
    'Body Work',
    'Bike Repair',
    'Tire Services'
  ];

  experienceOptions = [
    '1-2 years',
    '3-5 years',
    '6-10 years',
    '10+ years'
  ];

  constructor(
    private fb: FormBuilder,
    private mechanicService: MechanicService,
    private locationService: LocationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCurrentLocation();
  }

  initializeForm(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      shopName: ['', [Validators.required, Validators.minLength(3)]],
      shopAddress: ['', [Validators.required, Validators.minLength(10)]],
      experience: ['', Validators.required],
      specialization: [[], [Validators.required, Validators.minLength(1)]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }

  getCurrentLocation(): void {
    this.gettingLocation = true;
    this.locationService.getCurrentLocation().subscribe({
      next: (position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.registrationForm.patchValue({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        this.gettingLocation = false;
        this.snackBar.open('Location detected successfully!', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.gettingLocation = false;
        this.snackBar.open('Unable to get location. Please enter manually.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      
      const formData = { ...this.registrationForm.value };
      // Convert specialization array to comma-separated string
      formData.specialization = formData.specialization.join(',');
      
      this.mechanicService.register(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open(
              'Registration successful! Please wait for admin approval before you can login.',
              'Close',
              {
                duration: 5000,
                panelClass: ['success-snackbar']
              }
            );
            this.router.navigate(['/mechanic/login']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error?.message || 'Registration failed', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/mechanic/login']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
