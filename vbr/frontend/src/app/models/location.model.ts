export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
}

export interface LocationWithDistance extends Location {
  distanceKm: number;
  estimatedTimeMinutes: number;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

export interface AddressComponent {
  longName: string;
  shortName: string;
  types: string[];
}

export interface GeocodeResult {
  formattedAddress: string;
  geometry: {
    location: GeoLocation;
    locationType: string;
    viewport?: {
      northeast: GeoLocation;
      southwest: GeoLocation;
    };
  };
  addressComponents: AddressComponent[];
  placeId?: string;
}

export interface LocationBounds {
  northeast: GeoLocation;
  southwest: GeoLocation;
}

export interface ServiceArea {
  center: GeoLocation;
  radiusKm: number;
  name: string;
  isActive: boolean;
  cities?: string[];
}

export interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  instructions?: string[];
  waypoints?: GeoLocation[];
}

export interface LocationPermission {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
  error?: string;
}

export interface NearbySearch {
  location: GeoLocation;
  radius: number; // in kilometers
  type?: 'mechanic' | 'garage' | 'service_station';
}

export enum LocationAccuracy {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface LocationOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  accuracy?: LocationAccuracy;
}

export interface LocationError {
  code: number;
  message: string;
  type: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT';
}
