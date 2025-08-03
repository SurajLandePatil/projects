import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Booking, BookingRequest, BookingStatus } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBooking(bookingData: BookingRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`);
  }

  getUserBookings(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/user/${userId}`);
  }

  getMechanicBookings(mechanicId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/mechanic/${mechanicId}`);
  }

  acceptBooking(bookingId: number, mechanicId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/${bookingId}/accept`, { mechanicId });
  }

  // rejectBooking(bookingId: number): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/bookings/${bookingId}/reject`, {});
  // }
  // Accepts the reason as a parameter and sends it in the request body
rejectBooking(bookingId: number, reason: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/bookings/${bookingId}/reject`, { reason });
}




  updateBookingStatus(bookingId: number, status: BookingStatus): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${bookingId}/status`, { status });
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.updateBookingStatus(bookingId, BookingStatus.CANCELLED);
  }
}
