import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// HTTP Interceptor
import { HttpInterceptorService } from './interceptors/http-interceptor.service';

// Components
import { HomeComponent } from './components/home/home.component';

// User Components
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user/user-registration/user-registration.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { MechanicSearchComponent } from './components/user/mechanic-search/mechanic-search.component';
import { BookingRequestComponent } from './components/user/booking-request/booking-request.component';
import { ReviewRatingComponent } from './components/user/review-rating/review-rating.component';

// Mechanic Components
import { MechanicLoginComponent } from './components/mechanic/mechanic-login/mechanic-login.component';
import { MechanicRegistrationComponent } from './components/mechanic/mechanic-registration/mechanic-registration.component';
import { MechanicDashboardComponent } from './components/mechanic/mechanic-dashboard/mechanic-dashboard.component';
import { BookingNotificationComponent } from './components/mechanic/booking-notification/booking-notification.component';
import { RejectReasonDialogComponent } from './components/mechanic/reject-reason-dialog/reject-reason-dialog.component';

// Admin Components
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { MechanicApprovalComponent } from './components/admin/mechanic-approval/mechanic-approval.component';
import { ReportManagementComponent } from './components/admin/report-management/report-management.component';
import { MechanicDetailDialogComponent } from './components/admin/mechanic-detail-dialog/mechanic-detail-dialog.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';

// Shared Components
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { MapComponent } from './components/shared/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    // User Components
    UserLoginComponent,
    UserRegistrationComponent,
    UserDashboardComponent,
    MechanicSearchComponent,
    BookingRequestComponent,
    ReviewRatingComponent,

    // Mechanic Components
    MechanicLoginComponent,
    MechanicRegistrationComponent,
    MechanicDashboardComponent,
    BookingNotificationComponent,
    RejectReasonDialogComponent,

    // Admin Components
    AdminLoginComponent,
    AdminDashboardComponent,
    MechanicApprovalComponent,
    ReportManagementComponent,
    MechanicDetailDialogComponent,
    UserListComponent,

    // Shared Components
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,

    // Angular Material Modules (no duplicates!)
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatListModule,
    MatChipsModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
