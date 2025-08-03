import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotificationData {
  id?: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl;
  private notificationsSubject = new BehaviorSubject<NotificationData[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Send booking notification to mechanic
  sendBookingNotification(mechanicId: number, bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/booking`, {
      mechanicId,
      bookingData
    });
  }

  // Send booking accepted notification to user
  sendBookingAcceptedNotification(userId: number, bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/booking-accepted`, {
      userId,
      bookingData
    });
  }

  // Send location update notification
  sendLocationUpdateNotification(userId: number, locationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/location-update`, {
      userId,
      locationData
    });
  }

  // Broadcast notification to all users
  broadcastNotification(notificationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/broadcast`, notificationData);
  }

  // Test notification
  testNotification(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/test/${userId}`);
  }

  // Local notification management
  addNotification(notification: NotificationData): void {
    const currentNotifications = this.notificationsSubject.value;
    const newNotifications = [notification, ...currentNotifications].slice(0, 50); // Keep last 50
    this.notificationsSubject.next(newNotifications);

    // Show browser notification if permission granted
    this.showBrowserNotification(notification);
  }

  // 👇 ADD THIS METHOD to support dismiss by id
  dismissNotification(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(notification => notification.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  markAsRead(notificationId: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification =>
      ({ ...notification, read: true })
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  clearAllNotifications(): void {
    this.notificationsSubject.next([]);
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  // Request browser notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Show browser notification
  private showBrowserNotification(notification: NotificationData): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        tag: notification.type,
        requireInteraction: notification.type === 'BOOKING_REQUEST'
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };

      // Auto close after 5 seconds for non-critical notifications
      if (notification.type !== 'BOOKING_REQUEST') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  // Play notification sound
  playNotificationSound(type: string = 'default'): void {
    try {
      let soundFile = 'notification.mp3';

      switch (type) {
        case 'BOOKING_REQUEST':
          soundFile = 'urgent-notification.mp3';
          break;
        case 'BOOKING_ACCEPTED':
          soundFile = 'success-notification.mp3';
          break;
        case 'BOOKING_REJECTED':
          soundFile = 'error-notification.mp3';
          break;
        default:
          soundFile = 'notification.mp3';
      }

      const audio = new Audio(`/assets/sounds/${soundFile}`);
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play notification sound:', e));
    } catch (error) {
      console.log('Notification sound not available');
    }
  }
}
