import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user/user-registration/user-registration.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { MechanicSearchComponent } from './components/user/mechanic-search/mechanic-search.component';
import { BookingRequestComponent } from './components/user/booking-request/booking-request.component';
import { MechanicLoginComponent } from './components/mechanic/mechanic-login/mechanic-login.component';
import { MechanicRegistrationComponent } from './components/mechanic/mechanic-registration/mechanic-registration.component';
import { MechanicDashboardComponent } from './components/mechanic/mechanic-dashboard/mechanic-dashboard.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ReviewRatingComponent } from './components/user/review-rating/review-rating.component';
import { BookingNotificationComponent } from './components/mechanic/booking-notification/booking-notification.component';
import { MechanicApprovalComponent } from './components/admin/mechanic-approval/mechanic-approval.component';
import { ReportManagementComponent } from './components/admin/report-management/report-management.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';


// Guards
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';
import { MechanicGuard } from './guards/mechanic.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // User Routes
  { path: 'user/login', component: UserLoginComponent },
  { path: 'user/register', component: UserRegistrationComponent },
  { path: 'user/dashboard', component: UserDashboardComponent, canActivate: [UserGuard] },
  { path: 'user/mechanic-search', component: MechanicSearchComponent, canActivate: [UserGuard] },
  { path: 'user/booking-request', component: BookingRequestComponent, canActivate: [UserGuard] },
  { path: 'user/review-rating', component: ReviewRatingComponent, canActivate: [UserGuard] },
  
  // Mechanic Routes
  { path: 'mechanic/login', component: MechanicLoginComponent },
  { path: 'mechanic/register', component: MechanicRegistrationComponent },
  { path: 'mechanic/dashboard', component: MechanicDashboardComponent, },  // removed canActivate: [MechanicGuard] giviing some problems
  { path: 'mechanic/booking-notification', component: BookingNotificationComponent, canActivate: [MechanicGuard] },
  //{ path: 'mechanic/approval-pending', component: MechanicApprovalComponent },

  
  // Admin Routes
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/mechanic-approval', component: MechanicApprovalComponent, canActivate: [AdminGuard] },
  { path: 'admin/report-management', component: ReportManagementComponent, canActivate: [AdminGuard] },
  { path: 'admin/users', component: UserListComponent },


  // Redirect
 // { path: '**', redirectTo: '' }
  { path: '**', redirectTo: 'NotFoundComponent' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
