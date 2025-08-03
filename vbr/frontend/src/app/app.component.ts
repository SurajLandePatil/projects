import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './services/user.service';
import { MechanicService } from './services/mechanic.service';
import { NotificationService } from './services/notification.service';
import { WebsocketService } from './services/websocket.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    // Add animations here (if used in template)
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Vehicle Breakdown Assistance';
  isLoading = false;
  showHeader = true;
  showFooter = true;
  currentUserType: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private mechanicService: MechanicService,
    public notificationService: NotificationService, // 🔧 Made public to fix template access error
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.initializeApp();
    this.setupRouteListener();
    this.setupNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.websocketService.disconnect();
  }

  private initializeApp(): void {
    this.checkAuthState();
    this.notificationService.requestNotificationPermission();
    this.setupTheme();
  }

  private checkAuthState(): void {
    this.currentUserType = localStorage.getItem('userType');
    if (this.currentUserType) this.validateAuthData();
  }

  private validateAuthData(): void {
    try {
      let userData = null;
      switch (this.currentUserType) {
        case 'user':
          userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
          break;
        case 'mechanic':
          userData = JSON.parse(localStorage.getItem('currentMechanic') || '{}');
          break;
        case 'admin':
          userData = JSON.parse(localStorage.getItem('currentAdmin') || '{}');
          break;
      }
      if (!userData || !userData.id) this.clearAuthData();
    } catch (error) {
      console.error('Invalid auth data:', error);
      this.clearAuthData();
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('userType');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentMechanic');
    localStorage.removeItem('currentAdmin');
    this.currentUserType = null;
  }

  private setupRouteListener(): void {
    const routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.updateLayoutVisibility(event.url);
        this.scrollToTop();
      });
    this.subscriptions.push(routerSub);
  }

  private updateLayoutVisibility(url: string): void {
    const authRoutes = ['/user/login', '/user/register', '/mechanic/login', '/mechanic/register', '/admin/login'];
    const isAuthRoute = authRoutes.some(route => url.includes(route));
    this.showHeader = !isAuthRoute;
    this.showFooter = !isAuthRoute;
  }

  private scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  private setupNotifications(): void {
    if (this.currentUserType) this.connectWebSocket();

    const userSub = this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserType = 'user';
        this.connectWebSocket();
      } else if (this.currentUserType === 'user') {
        this.currentUserType = null;
        this.websocketService.disconnect();
      }
    });

    const mechanicSub = this.mechanicService.currentMechanic$.subscribe(mechanic => {
      if (mechanic) {
        this.currentUserType = 'mechanic';
        this.connectWebSocket();
      } else if (this.currentUserType === 'mechanic') {
        this.currentUserType = null;
        this.websocketService.disconnect();
      }
    });

    this.subscriptions.push(userSub, mechanicSub);
  }

  private connectWebSocket(): void {
    let userId: string | null = null;
    try {
      switch (this.currentUserType) {
        case 'user':
          const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
          userId = user.id?.toString();
          break;
        case 'mechanic':
          const mechanic = JSON.parse(localStorage.getItem('currentMechanic') || '{}');
          userId = mechanic.id?.toString();
          break;
        case 'admin':
          const admin = JSON.parse(localStorage.getItem('currentAdmin') || '{}');
          userId = admin.id?.toString();
          break;
      }

      if (userId) {
        this.websocketService.connect(userId);
        const wsSub = this.websocketService.getMessages().subscribe(message => {
          this.handleWebSocketMessage(message);
        });
        this.subscriptions.push(wsSub);
      }
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }
  }

  private handleWebSocketMessage(message: any): void {
    const notification = {
      id: Date.now(),
      type: message.type || 'GENERAL',
      title: this.getNotificationTitle(message.type),
      message: message.message || 'New notification',
      data: message,
      timestamp: new Date(),
      read: false
    };

    this.notificationService.addNotification(notification);
    this.notificationService.playNotificationSound(message.type);
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'BOOKING_REQUEST': return 'New Booking Request';
      case 'BOOKING_ACCEPTED': return 'Booking Accepted';
      case 'BOOKING_REJECTED': return 'Booking Rejected';
      case 'BOOKING_COMPLETED': return 'Service Completed';
      case 'LOCATION_UPDATE': return 'Location Update';
      case 'MECHANIC_APPROVED': return 'Profile Approved';
      case 'MECHANIC_REJECTED': return 'Profile Rejected';
      default: return 'Notification';
    }
  }

  private setupTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
  }

  setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  handleGlobalError(error: any): void {
    console.error('Global error:', error);
    // Optionally display UI error message here
  }

  dismissNotification(id: number): void {
    this.notificationService.dismissNotification(id);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'BOOKING_REQUEST': return 'assignment';
      case 'BOOKING_ACCEPTED': return 'check_circle';
      case 'BOOKING_REJECTED': return 'cancel';
      case 'BOOKING_COMPLETED': return 'done_all';
      case 'LOCATION_UPDATE': return 'location_on';
      case 'MECHANIC_APPROVED': return 'verified_user';
      case 'MECHANIC_REJECTED': return 'block';
      default: return 'notifications';
    }
  }

  showPwaPrompt = false;
  isOnline = navigator.onLine;

  dismissPwaPrompt(): void {
    this.showPwaPrompt = false;
  }

  updatePwa(): void {
    window.location.reload();
  }
}
