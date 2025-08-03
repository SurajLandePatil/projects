import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() {}

  getCurrentLocation(): Observable<GeolocationPosition> {
    return new Observable(observer => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
        );
        return;
      } else {
        observer.error('Geolocation is not supported by this browser.');
        return;
      }
    });
  }

  watchPosition(): Observable<GeolocationPosition> {
    return new Observable(observer => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            observer.next(position);
          },
          (error) => {
            observer.error(error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
        );
        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        observer.error('Geolocation is not supported by this browser.');
        return;
      }
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    } else {
      return `${distance.toFixed(1)} km`;
    }
  }
}
