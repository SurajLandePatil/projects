import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { MechanicService } from '../../../services/mechanic.service';
import { User } from '../../../models/user.model';
import { Mechanic } from '../../../models/mechanic.model';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentMechanic: Mechanic | null = null;
  currentUserType: string | null = null;
  currentRoute = '';
  isMenuOpen = false;
  
  private userSubscription?: Subscription;
  private mechanicSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private mechanicService: MechanicService,
    private router: Router,
    private dialog: MatDialog
  ) {}
ngOnInit(): void {
  // Subscribe to user changes
  this.userSubscription = this.userService.currentUser$.subscribe(user => {
    this.currentUser = user;
    this.updateUserType();
  });

  // Subscribe to mechanic changes
  this.mechanicSubscription = this.mechanicService.currentMechanic$.subscribe(mechanic => {
    this.currentMechanic = mechanic;
    this.updateUserType();
  });

  // Track current route
  this.routerSubscription = this.router.events
    .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe(event => {
      this.currentRoute = event.url;
    });

  // Initial setup
  this.updateUserType();
}

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.mechanicSubscription) {
      this.mechanicSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateUserType(): void {
    this.currentUserType = localStorage.getItem('userType');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  navigateHome(): void {
    this.router.navigate(['/']);
    this.closeMenu();
  }

  navigateToUserLogin(): void {
    this.router.navigate(['/user/login']);
    this.closeMenu();
  }

  navigateToMechanicLogin(): void {
    this.router.navigate(['/mechanic/login']);
    this.closeMenu();
  }

  navigateToAdminLogin(): void {
    this.router.navigate(['/admin/login']);
    this.closeMenu();
  }

  navigateToUserDashboard(): void {
    this.router.navigate(['/user/dashboard']);
    this.closeMenu();
  }

  navigateToMechanicDashboard(): void {
    this.router.navigate(['/mechanic/dashboard']);
    this.closeMenu();
  }

  navigateToAdminDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
    this.closeMenu();
  }

  logout(): void {

    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentMechanic');
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('userType');
  // this.currentUser = null;
  // this.currentMechanic = null;
  // this.currentUserType = null;
  // this.router.navigate(['/']);
  // this.closeMenu();


    if (this.currentUserType === 'user') {
      this.userService.logout();
    } else if (this.currentUserType === 'mechanic') {
      this.mechanicService.logout();
    } else if (this.currentUserType === 'admin') {
      localStorage.removeItem('currentAdmin');
      localStorage.removeItem('userType');
    }
    
    this.currentUser = null;
    this.currentMechanic = null;
    this.currentUserType = null;
    this.router.navigate(['/']);
    this.closeMenu();
  }

  isLoggedIn(): boolean {
    return this.currentUserType !== null;
  }

  getCurrentUserName(): string {
    // if (this.currentUser) {
    //   return this.currentUser.name;
    // } else if (this.currentMechanic) {
    //   return this.currentMechanic.name;
    // } else if (this.currentUserType === 'admin') {
    //   const admin = JSON.parse(localStorage.getItem('currentAdmin') || '{}');
    //   return admin.name || 'Admin';
    // }
    // return '';
    

     if (this.currentUserType === 'admin') {
      const admin = JSON.parse(localStorage.getItem('currentAdmin') || '{}');
        return admin?.name || 'Admin';
    } else if (this.currentUserType === 'mechanic' && this.currentMechanic) {
        return this.currentMechanic.name;
    } else if (this.currentUserType === 'user' && this.currentUser) {
        return this.currentUser.name;
    }
        return ''; 



  }

  getUserTypeLabel(): string {
    switch (this.currentUserType) {
      case 'user': return 'User';
      case 'mechanic': return 'Mechanic';
      case 'admin': return 'Admin';
      default: return '';
    }
  }

  getUserTypeIcon(): string {
    switch (this.currentUserType) {
      case 'user': return 'person';
      case 'mechanic': return 'build';
      case 'admin': return 'admin_panel_settings';
      default: return 'account_circle';
    }
  }

  isCurrentRoute(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}
