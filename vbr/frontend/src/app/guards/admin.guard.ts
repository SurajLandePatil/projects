import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userType = localStorage.getItem('userType');
    const currentAdmin = localStorage.getItem('currentAdmin');
    
    if (userType === 'admin' && currentAdmin) {
      try {
        const admin = JSON.parse(currentAdmin);
        if (admin && admin.id) {
          return true;
        }
      } catch (error) {
        console.error('Error parsing admin data:', error);
      }
    }
    
    // Redirect to admin login if not authenticated
    this.router.navigate(['/admin/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
}
