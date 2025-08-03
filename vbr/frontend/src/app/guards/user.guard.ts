// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserGuard implements CanActivate {

//   constructor(private router: Router) {}

//   canActivate(): boolean {
//     const userType = localStorage.getItem('userType');
//     const currentUser = localStorage.getItem('currentUser');
    
//     if (userType === 'user' && currentUser) {
//       return true;
//     }
//     this.router.navigate(['/user/login']);
//     return false;
//   }
// }


import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userType = localStorage.getItem('userType');
    const currentUser = localStorage.getItem('currentUser');
    
    if (userType === 'user' && currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user && user.id) {
          return true;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Redirect to user login if not authenticated
    this.router.navigate(['/user/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
}
