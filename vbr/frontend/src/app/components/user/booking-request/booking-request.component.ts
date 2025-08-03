import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from '../../../services/booking.service';
import { MechanicService } from '../../../services/mechanic.service';
import { LocationService } from '../../../services/location.service';
import { UserService } from '../../../services/user.service';
import { Mechanic } from '../../../models/mechanic.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-booking-request',
  templateUrl: './booking-request.component.html',
  styleUrls: ['./booking-request.component.css']
})
export class BookingRequestComponent implements OnInit {
  bookingForm!: FormGroup;
  selectedMechanic: Mechanic | null = null;
  currentUser: User | null = null;
  currentLocation: { lat: number, lng: number } | null = null;
  isLoading = false;
  isSubmitting = false;

  vehicleTypes = ['Car', 'Bike', 'Truck', 'Bus', 'Auto Rickshaw'];

  public getStarArray(rating: number): number[] {
  return Array(Math.round(rating)).fill(0);
}


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private mechanicService: MechanicService,
    private locationService: LocationService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/user/login']);
      return;
    }

    this.initializeForm();
    this.getCurrentLocation();
    this.loadSelectedMechanic();
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      vehicleType: ['', Validators.required],
      problemDescription: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  getCurrentLocation(): void {
    this.locationService.getCurrentLocation().subscribe({
      next: (position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      },
      error: (error) => {
        this.snackBar.open('Unable to get current location', 'Close', { duration: 3000 });
      }
    });
  }

  loadSelectedMechanic(): void {
    const mechanicId = this.route.snapshot.queryParams['mechanicId'];
    if (mechanicId) {
      this.isLoading = true;
      this.mechanicService.getMechanicById(mechanicId).subscribe({
        next: (mechanic) => {
          this.selectedMechanic = mechanic;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to load mechanic details', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.currentUser && this.currentLocation) {
      this.isSubmitting = true;

      const bookingData = {
        userId: this.currentUser.id,
        mechanicId: this.selectedMechanic?.id,
        userLatitude: this.currentLocation.lat,
        userLongitude: this.currentLocation.lng,
        vehicleType: this.bookingForm.value.vehicleType,
        problemDescription: this.bookingForm.value.problemDescription
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.snackBar.open('Booking request sent successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/user/dashboard']);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(error.error?.message || 'Failed to create booking', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/user/mechanic-search']);
  }
}
