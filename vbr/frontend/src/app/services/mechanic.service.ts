import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Mechanic, MechanicRegistration } from '../models/mechanic.model';

@Injectable({
  providedIn: 'root'
})
export class MechanicService {
  private apiUrl = environment.apiUrl;
  private currentMechanicSubject = new BehaviorSubject<Mechanic | null>(null);
  public currentMechanic$ = this.currentMechanicSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedMechanic = localStorage.getItem('currentMechanic');
    if (storedMechanic) {
      this.currentMechanicSubject.next(JSON.parse(storedMechanic));
    }
  }

  register(mechanicData: MechanicRegistration): Observable<any> {
    return this.http.post(`${this.apiUrl}/mechanics/register`, mechanicData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mechanics/login`, credentials)
      .pipe(map(response => {
        if (response && (response as any).success && (response as any).mechanic) {
          const mechanic = (response as any).mechanic;
          localStorage.setItem('currentMechanic', JSON.stringify(mechanic));
          localStorage.setItem('userType', 'mechanic');
          this.currentMechanicSubject.next(mechanic);
        }
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentMechanic');
    localStorage.removeItem('userType');
    this.currentMechanicSubject.next(null);
  }

  getCurrentMechanic(): Mechanic | null {
    return this.currentMechanicSubject.value;
  }

  getNearestMechanics(latitude: number, longitude: number): Observable<Mechanic[]> {
    return this.http.get<Mechanic[]>(`${this.apiUrl}/mechanics/nearest?latitude=${latitude}&longitude=${longitude}`);
  }

  getMechanicById(id: number): Observable<Mechanic> {
    return this.http.get<Mechanic>(`${this.apiUrl}/mechanics/${id}`);
  }

  updateLocation(id: number, latitude: number, longitude: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/mechanics/${id}/location`, { latitude, longitude });
  }

  updateAvailability(id: number, available: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/mechanics/${id}/availability`, { available });
  }

  isLoggedIn(): boolean {
    return this.currentMechanicSubject.value !== null;
  }
}
