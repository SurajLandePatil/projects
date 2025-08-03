// export interface Mechanic {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   shopName: string;
//   shopAddress: string;
//   experience: string;
//   specialization: string;
//   latitude: number;
//   longitude: number;
//   currentLatitude: number;
//   currentLongitude: number;
//   isApproved: boolean;
//   isAvailable: boolean;
//   averageRating?: number;
//   totalReviews?: number;
//   distanceFromUser?: number;
//   estimatedArrivalTime?: string;
//   createdAt?: Date;
// }

// export interface MechanicRegistration {
//   name: string;
//   email: string;
//   password: string;
//   phone: string;
//   shopName: string;
//   shopAddress: string;
//   experience: string;
//   specialization: string;
//   latitude: number;
//   longitude: number;
// }
export interface Mechanic {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional for security
  phone: string;
  shopName: string;
  shopAddress: string;
  experience: string;
  specialization: string;
  latitude: number;
  longitude: number;
  currentLatitude: number;
  currentLongitude: number;
  isApproved: boolean;
  isAvailable: boolean;
  createdAt: Date;
  
  // Extended fields for UI
  averageRating?: number;
  totalReviews?: number;
  distanceFromUser?: number;
  estimatedArrivalTime?: string;
  profileImage?: string;
  workingHours?: WorkingHours;
  serviceTypes?: ServiceType[];
  certifications?: string[];
  yearsOfExperience?: number;
  token?: string; // For authentication
}

export interface MechanicRegistration {
  name: string;
  email: string;
  password: string;
  phone: string;
  shopName: string;
  shopAddress: string;
  experience: string;
  specialization: string;
  latitude: number;
  longitude: number;
  certifications?: string[];
  workingHours?: WorkingHours;
  profileImage?: File;
  documents?: File[];
}

export interface MechanicProfile extends Omit<Mechanic, 'password'> {
  completedJobs: number;
  totalEarnings?: number;
  responseTime?: number; // in minutes
  badges?: Badge[];
  languages?: string[];
  insuranceValid?: boolean;
  licenseNumber?: string;
  businessRegistration?: string;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // "09:00"
  closeTime?: string; // "18:00"
  breaks?: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number; // in minutes
  priceRange: PriceRange;
  isEmergency?: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface MechanicStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageRating: number;
  totalReviews: number;
  responseTime: number;
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  popularServices: { name: string; count: number }[];
}

export interface MechanicLocation {
  mechanicId: number;
  latitude: number;
  longitude: number;
  lastUpdated: Date;
  isMoving?: boolean;
  speed?: number; // km/h
}

export interface MechanicFilter {
  specialization?: string[];
  experience?: string[];
  rating?: number;
  distance?: number;
  availability?: boolean;
  priceRange?: PriceRange;
  workingNow?: boolean;
}

export interface MechanicSearch {
  location: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in km
  filters?: MechanicFilter;
  sortBy?: 'distance' | 'rating' | 'price' | 'response_time';
  limit?: number;
}
