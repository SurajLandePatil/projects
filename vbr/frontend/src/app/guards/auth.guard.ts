// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private router: Router) {}

//   canActivate(): boolean {
//     const userType = localStorage.getItem('userType');
//     if (userType) {
//       return true;
//     }
//     this.router.navigate(['/']);
//     return false;
//   }
// }


import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userType = localStorage.getItem('userType');
    
    if (userType) {
      // Check if the stored data is valid
      let userData = null;
      try {
        switch (userType) {
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
        
        if (userData && userData.id) {
          return true;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Clear invalid data and redirect to home
    this.clearAuthData();
    this.router.navigate(['/'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }

  private clearAuthData(): void {
    localStorage.removeItem('userType');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentMechanic');
    localStorage.removeItem('currentAdmin');
  }
}
