// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { UserService } from '../../../services/user.service';
// import { BookingService } from '../../../services/booking.service';
// import { LocationService } from '../../../services/location.service';
// import { User } from '../../../models/user.model';
// import { Booking, BookingStatus } from '../../../models/booking.model';

// @Component({
//   selector: 'app-user-dashboard',
//   templateUrl: './user-dashboard.component.html',
//   styleUrls: ['./user-dashboard.component.css']
// })
// export class UserDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   recentBookings: Booking[] = [];
//   isLoadingBookings = false;
//   currentLocation: { lat: number, lng: number } | null = null;

//   constructor(
//     private userService: UserService,
//     private bookingService: BookingService,
//     private locationService: LocationService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void {
//     this.currentUser = this.userService.getCurrentUser();
//     if (!this.currentUser) {
//       this.router.navigate(['/user/login']);
//       return;
//     }
    
//     this.loadRecentBookings();
//     this.getCurrentLocation();
//   }

//   loadRecentBookings(): void {
//     if (!this.currentUser) return;
    
//     this.isLoadingBookings = true;
//     this.bookingService.getUserBookings(this.currentUser.id).subscribe({
//       next: (bookings) => {
//         this.recentBookings = bookings.slice(0, 5); // Get recent 5 bookings
//         this.isLoadingBookings = false;
//       },
//       error: (error) => {
//         this.isLoadingBookings = false;
//         this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
//       }
//     });
//   }

//   getCurrentLocation(): void {
//     this.locationService.getCurrentLocation().subscribe({
//       next: (position) => {
//         this.currentLocation = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         };
//       },
//       error: (error) => {
//         this.snackBar.open('Unable to get current location', 'Close', { duration: 3000 });
//       }
//     });
//   }

//   requestBreakdownAssistance(): void {
//     if (!this.currentLocation) {
//       this.snackBar.open('Please allow location access to request assistance', 'Close', { duration: 3000 });
//       return;
//     }
//     this.router.navigate(['/user/mechanic-search']);
//   }

//   viewAllBookings(): void {
//     this.router.navigate(['/user/bookings']);
//   }

//   getStatusColor(status: BookingStatus): string {
//     switch (status) {
//       case BookingStatus.PENDING: return 'orange';
//       case BookingStatus.ACCEPTED: return 'blue';
//       case BookingStatus.IN_PROGRESS: return 'purple';
//       case BookingStatus.COMPLETED: return 'green';
//       case BookingStatus.CANCELLED: return 'red';
//       case BookingStatus.REJECTED: return 'red';
//       default: return 'gray';
//     }
//   }

//   logout(): void {
//     this.userService.logout();
//     this.router.navigate(['/']);
//   }
// }




import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { BookingService } from '../../../services/booking.service';
import { LocationService } from '../../../services/location.service';
import { WebsocketService } from '../../../services/websocket.service';
import { User } from '../../../models/user.model';
import { Booking, BookingStatus } from '../../../models/booking.model';
import { ReviewRatingComponent } from '../review-rating/review-rating.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentBookings: Booking[] = [];
  isLoadingBookings = false;
  currentLocation: { lat: number, lng: number } | null = null;
  activeBooking: Booking | null = null;
  
  // Stats
  totalBookings = 0;
  completedBookings = 0;
  pendingBookings = 0;

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private locationService: LocationService,
    private websocketService: WebsocketService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/user/login']);
      return;
    }
    
    this.loadRecentBookings();
    this.getCurrentLocation();
    this.setupWebSocketConnection();
  }

  loadRecentBookings(): void {
    if (!this.currentUser) return;
    
    this.isLoadingBookings = true;
    this.bookingService.getUserBookings(this.currentUser.id).subscribe({
      next: (bookings) => {
        this.recentBookings = bookings.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);
        
        // Calculate stats
        this.totalBookings = bookings.length;
        this.completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED).length;
        this.pendingBookings = bookings.filter(b => 
          b.status === BookingStatus.PENDING || 
          b.status === BookingStatus.ACCEPTED || 
          b.status === BookingStatus.IN_PROGRESS
        ).length;
        
        // Find active booking
        this.activeBooking = bookings.find(b => 
          b.status === BookingStatus.ACCEPTED || b.status === BookingStatus.IN_PROGRESS
        ) || null;
        
        this.isLoadingBookings = false;
      },
      error: (error) => {
        this.isLoadingBookings = false;
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
      }
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
        console.log('Could not get current location');
      }
    });
  }

  setupWebSocketConnection(): void {
    if (this.currentUser) {
      this.websocketService.connect(this.currentUser.id.toString());
      this.websocketService.getMessages().subscribe(message => {
        this.handleNotification(message);
      });
    }
  }

  handleNotification(notification: any): void {
    switch (notification.type) {
      case 'BOOKING_ACCEPTED':
        this.snackBar.open('Your booking has been accepted!', 'View', {
          duration: 5000,
          panelClass: ['success-snackbar']
        }).onAction().subscribe(() => {
          this.loadRecentBookings();
        });
        break;
      case 'BOOKING_COMPLETED':
        this.snackBar.open('Service completed! Please rate your experience.', 'Rate', {
          duration: 8000,
          panelClass: ['success-snackbar']
        }).onAction().subscribe(() => {
          this.openReviewDialog(notification.bookingData);
        });
        break;
      default:
        this.snackBar.open(notification.message, 'Close', { duration: 3000 });
    }
  }

  requestBreakdownAssistance(): void {
    if (!this.currentLocation) {
      this.snackBar.open('Please allow location access to request assistance', 'Close', { duration: 3000 });
      this.getCurrentLocation();
      return;
    }
    this.router.navigate(['/user/mechanic-search']);
  }

  viewAllBookings(): void {
    this.router.navigate(['/user/bookings']);
  }

  viewBookingDetails(booking: Booking): void {
    this.router.navigate(['/user/booking-details', booking.id]);
  }

  cancelBooking(booking: Booking): void {
    if (booking.status === BookingStatus.PENDING) {
      this.bookingService.cancelBooking(booking.id).subscribe({
        next: () => {
          this.snackBar.open('Booking cancelled successfully', 'Close', { duration: 3000 });
          this.loadRecentBookings();
        },
        error: () => {
          this.snackBar.open('Failed to cancel booking', 'Close', { duration: 3000 });
        }
      });
    }
  }

  openReviewDialog(booking: Booking): void {
    // You would need to get mechanic details first
    // For now, we'll show a simple message
    this.snackBar.open('Review feature coming soon!', 'Close', { duration: 3000 });
  }

  getStatusColor(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING: return '#ff9800';
      case BookingStatus.ACCEPTED: return '#2196f3';
      case BookingStatus.IN_PROGRESS: return '#9c27b0';
      case BookingStatus.COMPLETED: return '#4caf50';
      case BookingStatus.CANCELLED: return '#f44336';
      case BookingStatus.REJECTED: return '#f44336';
      default: return '#666';
    }
  }

  getStatusIcon(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING: return 'schedule';
      case BookingStatus.ACCEPTED: return 'check_circle';
      case BookingStatus.IN_PROGRESS: return 'build_circle';
      case BookingStatus.COMPLETED: return 'task_alt';
      case BookingStatus.CANCELLED: return 'cancel';
      case BookingStatus.REJECTED: return 'cancel';
      default: return 'help';
    }
  }

  getCompletedBookingsCount(): number {
    return this.completedBookings;
  }

  getPendingBookingsCount(): number {
    return this.pendingBookings;
  }

  logout(): void {
    this.websocketService.disconnect();
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
