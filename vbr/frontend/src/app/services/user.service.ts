import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, UserRegistration, UserLogin } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(userData: UserRegistration): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  login(credentials: UserLogin): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials)
      .pipe(map(response => {
        if (response && (response as any).success && (response as any).user) {
          const user = (response as any).user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('userType', 'user');
          this.currentUserSubject.next(user);
        }
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
