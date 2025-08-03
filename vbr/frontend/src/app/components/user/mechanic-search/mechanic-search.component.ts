import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MechanicService } from '../../../services/mechanic.service';
import { LocationService } from '../../../services/location.service';
import { BookingService } from '../../../services/booking.service';
import { UserService } from '../../../services/user.service';
import { Mechanic } from '../../../models/mechanic.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-mechanic-search',
  templateUrl: './mechanic-search.component.html',
  styleUrls: ['./mechanic-search.component.css']
})
export class MechanicSearchComponent implements OnInit {
  mechanics: Mechanic[] = [];
  filteredMechanics: Mechanic[] = [];
  isLoading = false;
  currentUser: User | null = null;
  currentLocation: { lat: number, lng: number } | null = null;
  searchQuery = '';
  selectedSpecialization = '';
  specializations = [
    'Car Engine',
    'Brakes',
    'Transmission',
    'AC Repair',
    'Electrical',
    'Suspension',
    'Bike Repair'
  ];

  constructor(
    private mechanicService: MechanicService,
    public locationService: LocationService,  // <-- made public!
    private bookingService: BookingService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/user/login']);
      return;
    }
    this.getCurrentLocationAndLoadMechanics();
  }

  getCurrentLocationAndLoadMechanics(): void {
    this.locationService.getCurrentLocation().subscribe({
      next: (position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.loadNearestMechanics();
      },
      error: (error) => {
        this.snackBar.open('Please allow location access to find mechanics', 'Close', {
          duration: 3000
        });
      }
    });
  }

  loadNearestMechanics(): void {
    if (!this.currentLocation) return;

    this.isLoading = true;
    this.mechanicService.getNearestMechanics(this.currentLocation.lat, this.currentLocation.lng)
      .subscribe({
        next: (mechanics:any[]) => {
          this.mechanics = mechanics.map(mechanic => ({
  ...mechanic,
  isAvailable: mechanic.hasOwnProperty('available')
    ? mechanic['available']
    : mechanic['isAvailable'],
  // ...other fields
  distanceFromUser: this.locationService.calculateDistance(
    this.currentLocation!.lat,
    this.currentLocation!.lng,
    mechanic.currentLatitude,
    mechanic.currentLongitude
  )
}));

          this.filteredMechanics = [...this.mechanics];
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to load mechanics', 'Close', { duration: 3000 });
        }
      });
  }

  filterMechanics(): void {
    this.filteredMechanics = this.mechanics.filter(mechanic => {
      const matchesSearch = mechanic.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           mechanic.shopName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesSpecialization = !this.selectedSpecialization || 
                                   mechanic.specialization.includes(this.selectedSpecialization);
      return matchesSearch && matchesSpecialization;
    });
  }

  requestMechanic(mechanic: Mechanic): void {
    this.router.navigate(['/user/booking-request'], {
      queryParams: { mechanicId: mechanic.id }
    });
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.floor(rating || 0));
    }
    return stars;
  }

  goBack(): void {
    this.router.navigate(['/user/dashboard']);
  }

  // 🟢 Fix: Make this public so you can access in template
  public calculateEstimatedTime(distance: number): string {
    const speedKmH = 40;
    if (!distance || isNaN(distance)) return '';
    const hours = distance / speedKmH;
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    } else {
      return `${hours.toFixed(1)} hr`;
    }
  }

  // 🟢 Fix: Add a viewMechanicDetails method
  public viewMechanicDetails(mechanic: Mechanic): void {
    // Implement this as needed, for example:
    this.router.navigate(['/mechanic-profile', mechanic.id]);
    // or open a dialog, etc.
  }
}
