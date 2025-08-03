import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MechanicGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userType = localStorage.getItem('userType');
    const currentMechanic = localStorage.getItem('currentMechanic');
    
    if (userType === 'mechanic' && currentMechanic) {
      try {
        const mechanic = JSON.parse(currentMechanic);
        if (mechanic && mechanic.id) {
          // Check if mechanic is approved
          if (mechanic.isApproved) {
            return true;
          } else {
            // Mechanic not approved yet
            this.router.navigate(['/mechanic/approval-pending']);
            return false;
          }
        }
      } catch (error) {
        console.error('Error parsing mechanic data:', error);
      }
    }
    
    // Redirect to mechanic login if not authenticated
    this.router.navigate(['/mechanic/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
}
