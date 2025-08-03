import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from '../../../services/booking.service';
import { MechanicService } from '../../../services/mechanic.service';
import { WebsocketService } from '../../../services/websocket.service';
import { Mechanic } from '../../../models/mechanic.model';
import { Booking, BookingStatus } from '../../../models/booking.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RejectReasonDialogComponent } from '../reject-reason-dialog/reject-reason-dialog.component'; // Adjust path if needed
@Component({
  selector: 'app-booking-notification',
  templateUrl: './booking-notification.component.html',
  styleUrls: ['./booking-notification.component.css']
})
export class BookingNotificationComponent implements OnInit, OnDestroy {
  currentMechanic: Mechanic | null = null;
  notifications: any[] = [];
  pendingBookings: Booking[] = [];
  isLoading = false;
  private wsSubscription?: Subscription;

  constructor(
    private bookingService: BookingService,
    private mechanicService: MechanicService,
    private websocketService: WebsocketService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentMechanic = this.mechanicService.getCurrentMechanic();
    if (this.currentMechanic) {
      this.loadPendingBookings();
      this.setupWebSocketConnection();
    }
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.websocketService.disconnect();
  }

  loadPendingBookings(): void {
    if (!this.currentMechanic) return;

    this.isLoading = true;
    this.bookingService.getMechanicBookings(this.currentMechanic.id).subscribe({
      next: (bookings) => {
        this.pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
      }
    });
  }

  setupWebSocketConnection(): void {
    if (this.currentMechanic) {
      this.websocketService.connect(this.currentMechanic.id.toString());
      this.wsSubscription = this.websocketService.getMessages().subscribe(message => {
        this.handleNotification(message);
      });
    }
  }

  handleNotification(notification: any): void {
    this.notifications.unshift({
      ...notification,
      timestamp: new Date(),
      read: false
    });

    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    if (notification.type === 'BOOKING_REQUEST') {
      this.loadPendingBookings();
      this.playNotificationSound();
      this.snackBar.open('New booking request received!', 'View', {
        duration: 10000,
        panelClass: ['success-snackbar']
      }).onAction().subscribe(() => {
        this.markNotificationAsRead(notification);
      });
    }
  }

  acceptBooking(bookingId: number): void {
    if (!this.currentMechanic) return;

    this.bookingService.acceptBooking(bookingId, this.currentMechanic.id).subscribe({
      next: () => {
        this.snackBar.open('Booking accepted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadPendingBookings();
      },
      error: () => {
        this.snackBar.open('Failed to accept booking', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  rejectBooking(bookingId: number): void {
    // Open dialog to get the rejection reason
    const dialogRef = this.dialog.open(RejectReasonDialogComponent, { width: '320px' });
    dialogRef.afterClosed().subscribe((reason: string) => {
      if (reason) {
        this.bookingService.rejectBooking(bookingId, reason).subscribe({
          next: () => {
            this.snackBar.open('Booking rejected', 'Close', { duration: 3000 });
            this.loadPendingBookings();
          },
          error: () => {
            this.snackBar.open('Failed to reject booking', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  markNotificationAsRead(notification: any): void {
    const index = this.notifications.findIndex(n => n.timestamp === notification.timestamp);
    if (index !== -1) {
      this.notifications[index].read = true;
    }
  }

  clearAllNotifications(): void {
    this.notifications = [];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  private playNotificationSound(): void {
    try {
      const audio = new Audio('assets/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play notification sound'));
    } catch (error) {
      console.log('Notification sound not available');
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'BOOKING_REQUEST': return 'notification_important';
      case 'BOOKING_ACCEPTED': return 'check_circle';
      case 'BOOKING_REJECTED': return 'cancel';
      case 'LOCATION_UPDATE': return 'location_on';
      default: return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'BOOKING_REQUEST': return '#ff9800';
      case 'BOOKING_ACCEPTED': return '#4caf50';
      case 'BOOKING_REJECTED': return '#f44336';
      case 'LOCATION_UPDATE': return '#2196f3';
      default: return '#666';
    }
  }
}
