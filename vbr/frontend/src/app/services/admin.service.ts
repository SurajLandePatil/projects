import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loginAdmin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, { email, password });
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dashboard/stats`);
  }

  getPendingMechanics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/mechanics/pending`);
  }

  getApprovedMechanics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/mechanics/approved`);
  }

  approveMechanic(mechanicId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/mechanics/${mechanicId}/approve`, {});
  }

  rejectMechanic(mechanicId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/mechanics/${mechanicId}/reject`, {});
  }

  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/reports`);
  }

  getPendingReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/reports/pending`);
  }

  resolveReport(reportId: number, action: { action: string }): Observable<any> {
    return this.
    
    http.post(`${this.apiUrl}/admin/reports/${reportId}/resolve`, action);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
    // or whatever your API path is
  }
}
