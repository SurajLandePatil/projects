// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MechanicService } from '../../../services/mechanic.service';
// import { BookingService } from '../../../services/booking.service';
// import { WebsocketService } from '../../../services/websocket.service';
// import { Mechanic } from '../../../models/mechanic.model';
// import { Booking, BookingStatus } from '../../../models/booking.model';
// import { FormsModule } from '@angular/forms';


// @Component({
//   selector: 'app-mechanic-dashboard',
//   templateUrl: './mechanic-dashboard.component.html',
//   styleUrls: ['./mechanic-dashboard.component.css']
// })
// export class MechanicDashboardComponent implements OnInit {
//   currentMechanic: Mechanic | null = null;
//   pendingBookings: Booking[] = [];
//   recentBookings: Booking[] = [];
//   isAvailable = true;
//   isLoading = false;

//   constructor(
//     private mechanicService: MechanicService,
//     private bookingService: BookingService,
//     private websocketService: WebsocketService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void {
//     this.currentMechanic = this.mechanicService.getCurrentMechanic();
//     if (!this.currentMechanic) {
//       this.router.navigate(['/mechanic/login']);
//       return;
//     }

//     this.isAvailable = this.currentMechanic.isAvailable;
//     this.loadBookings();
//     this.setupWebSocketConnection();
//   }

//   loadBookings(): void {
//     if (!this.currentMechanic) return;

//     this.isLoading = true;
//     this.bookingService.getMechanicBookings(this.currentMechanic.id).subscribe({
//       next: (bookings) => {
//         this.pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
//         this.recentBookings = bookings.slice(0, 5);
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.isLoading = false;
//         this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
//       }
//     });
//   }

//   setupWebSocketConnection(): void {
//     if (this.currentMechanic) {
//       this.websocketService.connect(this.currentMechanic.id.toString());
//       this.websocketService.getMessages().subscribe(message => {
//         if (message.type === 'BOOKING_REQUEST') {
//           this.loadBookings();
//           this.snackBar.open('New booking request received!', 'View', {
//             duration: 5000,
//             panelClass: ['success-snackbar']
//           }).onAction().subscribe(() => {
//             this.router.navigate(['/mechanic/bookings']);
//           });
//         }
//       });
//     }
//   }

//   // toggleAvailability(): void {
//   //   if (!this.currentMechanic) return;

//   //   this.mechanicService.updateAvailability(this.currentMechanic.id, !this.isAvailable)
//   //     .subscribe({
//   //       next: () => {
//   //         this.isAvailable = !this.isAvailable;
//   //         this.snackBar.open(
//   //           `You are now ${this.isAvailable ? 'available' : 'unavailable'} for bookings`,
//   //           'Close',
//   //           { duration: 3000 }
//   //         );
//   //       },
//   //       error: () => {
//   //         this.snackBar.open('Failed to update availability', 'Close', { duration: 3000 });
//   //       }
//   //     });
//   // }
//   toggleAvailability(): void {
//   if (!this.currentMechanic) return;

//   const updatedStatus = !this.isAvailable;

//   this.mechanicService.updateAvailability(this.currentMechanic.id, updatedStatus)
//     .subscribe({
//       next: () => {
//         this.isAvailable = updatedStatus;
//         this.currentMechanic!.isAvailable = updatedStatus;
//         localStorage.setItem('currentMechanic', JSON.stringify(this.currentMechanic));

//         this.snackBar.open(
//           `You are now ${this.isAvailable ? 'available' : 'unavailable'} for bookings`,
//           'Close',
//           { duration: 3000 }
//         );
//       },
//       error: () => {
//         this.snackBar.open('Failed to update availability', 'Close', { duration: 3000 });
//       }
//     });
// }






//   acceptBooking(bookingId: number): void {
//     if (!this.currentMechanic) return;

//     this.bookingService.acceptBooking(bookingId, this.currentMechanic.id).subscribe({
//       next: () => {
//         this.snackBar.open('Booking accepted successfully!', 'Close', { duration: 3000 });
//         this.loadBookings();
//       },
//       error: () => {
//         this.snackBar.open('Failed to accept booking', 'Close', { duration: 3000 });
//       }
//     });
//   }

//   rejectBooking(bookingId: number): void {
//     this.bookingService.rejectBooking(bookingId).subscribe({
//       next: () => {
//         this.snackBar.open('Booking rejected', 'Close', { duration: 3000 });
//         this.loadBookings();
//       },
//       error: () => {
//         this.snackBar.open('Failed to reject booking', 'Close', { duration: 3000 });
//       }
//     });
//   }

//   logout(): void {
//     this.websocketService.disconnect();
//     this.mechanicService.logout();
//     this.router.navigate(['/']);
//   }
//   public getStatusColor(status: BookingStatus | string): string {
//     switch (status) {
//       case BookingStatus.PENDING:
//       case 'PENDING':
//         return '#ff9800'; // orange
//       case BookingStatus.ACCEPTED:
//       case 'ACCEPTED':
//         return '#1976d2'; // blue
//       case BookingStatus.IN_PROGRESS:
//       case 'IN_PROGRESS':
//         return '#ffeb3b'; // yellow
//       case BookingStatus.COMPLETED:
//       case 'COMPLETED':
//         return '#4caf50'; // green
//       case BookingStatus.CANCELLED:
//       case 'CANCELLED':
//         return '#f44336'; // red
//       default:
//         return '#9e9e9e'; // gray
//     }
//   }
// }





























import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MechanicService } from '../../../services/mechanic.service';
import { BookingService } from '../../../services/booking.service';
import { WebsocketService } from '../../../services/websocket.service';
import { Mechanic } from '../../../models/mechanic.model';
import { Booking, BookingStatus } from '../../../models/booking.model';
import { MatDialog } from '@angular/material/dialog';
import { RejectReasonDialogComponent } from '../reject-reason-dialog/reject-reason-dialog.component';



@Component({
  selector: 'app-mechanic-dashboard',
  templateUrl: './mechanic-dashboard.component.html',
  styleUrls: ['./mechanic-dashboard.component.css']
})
export class MechanicDashboardComponent implements OnInit {
  currentMechanic: Mechanic | null = null;
  pendingBookings: Booking[] = [];
  recentBookings: Booking[] = [];
  isAvailable = true;
  isLoading = false;

  constructor(
    private mechanicService: MechanicService,
    private bookingService: BookingService,
    private websocketService: WebsocketService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentMechanic = this.mechanicService.getCurrentMechanic();

    // If not logged in, redirect
    if (!this.currentMechanic) {
      this.router.navigate(['/mechanic/login']);
      return;
    }

    // Ensure boolean flag is set correctly
    this.isAvailable =
      typeof this.currentMechanic.isAvailable === 'boolean'
        ? this.currentMechanic.isAvailable
        : true; // Default true

    this.loadBookings();
    this.setupWebSocketConnection();
  }

  loadBookings(): void {
    if (!this.currentMechanic) return;

    this.isLoading = true;

    this.bookingService.getMechanicBookings(this.currentMechanic.id).subscribe({
      next: (bookings) => {
        this.pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
        this.recentBookings = bookings.slice(0, 5);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
      }
    });
  }

  setupWebSocketConnection(): void {
    if (this.currentMechanic) {
      this.websocketService.connect(this.currentMechanic.id.toString());
      this.websocketService.getMessages().subscribe(message => {
        if (message.type === 'BOOKING_REQUEST') {
          this.loadBookings();
          this.snackBar.open('New booking request received!', 'View', {
            duration: 5000,
            panelClass: ['success-snackbar']
          }).onAction().subscribe(() => {
            this.router.navigate(['/mechanic/bookings']);
          });
        }
      });
    }
  }

  // THIS IS THE MAIN FIXED FUNCTION
  toggleAvailability(): void {
    if (!this.currentMechanic) return;

    const updatedStatus = !this.isAvailable;

    this.mechanicService.updateAvailability(this.currentMechanic.id, updatedStatus)
      .subscribe({
        next: () => {
          this.isAvailable = updatedStatus;
          this.currentMechanic!.isAvailable = updatedStatus;
          localStorage.setItem('currentMechanic', JSON.stringify(this.currentMechanic));
          this.snackBar.open(
            `You are now ${this.isAvailable ? 'available' : 'unavailable'} for bookings`,
            'Close',
            { duration: 3000 }
          );
        },
        error: () => {
          // Optionally revert UI if backend fails
          this.isAvailable = !updatedStatus;
          this.snackBar.open('Failed to update availability', 'Close', { duration: 3000 });
        }
      });
  }

  acceptBooking(bookingId: number): void {
    if (!this.currentMechanic) return;

    this.bookingService.acceptBooking(bookingId, this.currentMechanic.id).subscribe({
      next: () => {
        this.snackBar.open('Booking accepted successfully!', 'Close', { duration: 3000 });
        this.loadBookings();
      },
      error: () => {
        this.snackBar.open('Failed to accept booking', 'Close', { duration: 3000 });
      }
    });
  }

  // rejectBooking(bookingId: number): void {
  //   this.bookingService.rejectBooking(bookingId).subscribe({
  //     next: () => {
  //       this.snackBar.open('Booking rejected', 'Close', { duration: 3000 });
  //       this.loadBookings();
  //     },
  //     error: () => {
  //       this.snackBar.open('Failed to reject booking', 'Close', { duration: 3000 });
  //     }
  //   });
  // }
  rejectBooking(bookingId: number): void {
  const dialogRef = this.dialog.open(RejectReasonDialogComponent, { width: '320px' });
  dialogRef.afterClosed().subscribe(reason => {
    if (reason) {
      this.bookingService.rejectBooking(bookingId, reason).subscribe({
        next: () => {
          this.snackBar.open('Booking rejected', 'Close', { duration: 3000 });
          this.loadBookings();
        },
        error: () => {
          this.snackBar.open('Failed to reject booking', 'Close', { duration: 3000 });
        }
      });
    }
  });
}


  logout(): void {
    this.websocketService.disconnect();
    this.mechanicService.logout();
    this.router.navigate(['/']);
  }

  public getStatusColor(status: BookingStatus | string): string {
    switch (status) {
      case BookingStatus.PENDING:
      case 'PENDING':
        return '#ff9800'; // orange
      case BookingStatus.ACCEPTED:
      case 'ACCEPTED':
        return '#1976d2'; // blue
      case BookingStatus.IN_PROGRESS:
      case 'IN_PROGRESS':
        return '#ffeb3b'; // yellow
      case BookingStatus.COMPLETED:
      case 'COMPLETED':
        return '#4caf50'; // green
      case BookingStatus.CANCELLED:
      case 'CANCELLED':
        return '#f44336'; // red
      default:
        return '#9e9e9e'; // gray
    }
  }
}
