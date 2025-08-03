// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   createdAt?: Date;
// }

// export interface UserRegistration {
//   name: string;
//   email: string;
//   password: string;
//   phone: string;
// }

// export interface UserLogin {
//   email: string;
//   password: string;
// }
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  
  // Extended fields for profile
  profileImage?: string;
  dateOfBirth?: Date;
  address?: Address;
  emergencyContact?: EmergencyContact;
  preferences?: UserPreferences;
  isVerified?: boolean;
  lastLoginAt?: Date;
  token?: string; // For authentication
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth?: Date;
  address?: Address;
  emergencyContact?: EmergencyContact;
  acceptTerms: boolean;
}

export interface UserLogin {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserProfile extends Omit<User, 'password'> {
  totalBookings: number;
  completedBookings: number;
  totalSpent: number;
  memberSince: Date;
  loyaltyPoints?: number;
  preferredMechanics?: number[];
  vehicles?: Vehicle[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  email?: string;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  language: string;
  currency: string;
  theme: 'light' | 'dark' | 'auto';
  units: 'metric' | 'imperial';
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  bookingUpdates: boolean;
  promotions: boolean;
  mechanicMessages: boolean;
  serviceReminders: boolean;
}

export interface PrivacySettings {
  shareLocation: boolean;
  shareProfile: boolean;
  allowReviews: boolean;
  dataCollection: boolean;
  targetedAds: boolean;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  isDefault: boolean;
  lastServiceDate?: Date;
  nextServiceDue?: Date;
  mileage?: number;
  insuranceExpiry?: Date;
  registrationExpiry?: Date;
}

export interface UserStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  averageRating: number; // rating given to mechanics
  favouriteMechanics: number[];
  mostUsedServices: { service: string; count: number }[];
  bookingHistory: {
    thisMonth: number;
    lastMonth: number;
    thisYear: number;
  };
}

export interface UserActivity {
  id: number;
  type: 'LOGIN' | 'BOOKING_CREATED' | 'BOOKING_COMPLETED' | 'REVIEW_POSTED' | 'PROFILE_UPDATED';
  description: string;
  timestamp: Date;
  metadata?: any;
}

export interface UserVerification {
  email: boolean;
  phone: boolean;
  identity: boolean;
  documents?: VerificationDocument[];
}

export interface VerificationDocument {
  id: number;
  type: 'ID_CARD' | 'PASSPORT' | 'DRIVING_LICENSE' | 'UTILITY_BILL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: Date;
  verifiedAt?: Date;
  notes?: string;
}

export interface UserSearch {
  query?: string;
  filters?: {
    location?: string;
    joinedAfter?: Date;
    totalBookings?: { min?: number; max?: number };
    isVerified?: boolean;
  };
  sortBy?: 'name' | 'joined_date' | 'total_bookings' | 'last_active';
  limit?: number;
  offset?: number;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  preferences?: UserPreferences;
  profileImage?: File;
}

export interface PasswordReset {
  email: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface LoyaltyProgram {
  userId: number;
  points: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  rewards: Reward[];
  pointsHistory: PointsTransaction[];
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  isActive: boolean;
  validUntil?: Date;
}

export interface PointsTransaction {
  id: number;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED';
  points: number;
  reason: string;
  timestamp: Date;
  relatedBookingId?: number;
}
