import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedRequest = this.addHeaders(request);

    return next.handle(modifiedRequest).pipe(
      timeout(this.REQUEST_TIMEOUT),
      retry(1),
      catchError((error: any) => this.handleError(error))
    );
  }

  private addHeaders(request: HttpRequest<any>): HttpRequest<any> {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const userType = localStorage.getItem('userType');
    let token: string | null = null;

    try {
      switch (userType) {
        case 'user':
          token = JSON.parse(localStorage.getItem('currentUser') || '{}')?.token;
          break;
        case 'mechanic':
          token = JSON.parse(localStorage.getItem('currentMechanic') || '{}')?.token;
          break;
        case 'admin':
          token = JSON.parse(localStorage.getItem('currentAdmin') || '{}')?.token;
          break;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (userType) {
      headers['X-User-Type'] = userType;
    }

    headers['X-Request-ID'] = this.generateRequestId();

    return request.clone({ setHeaders: headers });
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    let shouldRedirect = false;

    if (error instanceof TimeoutError) {
      errorMessage = 'Request timeout. Please check your connection and try again.';
    } else if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Session expired. Please login again.';
          shouldRedirect = true;
          this.clearAuthData();
          break;
        case 403:
          errorMessage = 'Access denied. You don\'t have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Requested resource not found.';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict occurred. Please try again.';
          break;
        case 422:
          errorMessage = error.error?.message || 'Validation error. Please check your input.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 502:
          errorMessage = 'Server temporarily unavailable. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
        case 504:
          errorMessage = 'Gateway timeout. Please try again.';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
      }
    }

    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });

    if (shouldRedirect) {
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }

    console.error('HTTP Error:', error);

    return throwError(() => ({
      ...error,
      userMessage: errorMessage
    }));
  }

  private clearAuthData(): void {
    localStorage.removeItem('userType');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentMechanic');
    localStorage.removeItem('currentAdmin');
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
