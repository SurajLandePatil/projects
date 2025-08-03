// export interface Booking {
//   id: number;
//   userId: number;
//   mechanicId?: number;
//   userLatitude: number;
//   userLongitude: number;
//   vehicleType: string;
//   problemDescription: string;
//   status: BookingStatus;
//   createdAt: Date;
//   acceptedAt?: Date;
//   completedAt?: Date;
// }

// export enum BookingStatus {
//   PENDING = 'PENDING',
//   ACCEPTED = 'ACCEPTED',
//   REJECTED = 'REJECTED',
//   IN_PROGRESS = 'IN_PROGRESS',
//   COMPLETED = 'COMPLETED',
//   CANCELLED = 'CANCELLED'
// }

// export interface BookingRequest {
//   userId: number;
//   mechanicId?: number;
//   userLatitude: number;
//   userLongitude: number;
//   vehicleType: string;
//   problemDescription: string;
// }

export interface Booking {
  id: number;
  userId: number;
  mechanicId?: number;
  userLatitude: number;
  userLongitude: number;
  vehicleType: string;
  problemDescription: string;
  status: BookingStatus;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  
  // Extended fields for UI
  userName?: string;
  mechanicName?: string;
  estimatedCost?: number;
  actualCost?: number;
  distance?: number;
  estimatedArrivalTime?: string;
  notes?: string;
  rejectedReason?: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface BookingRequest {
  userId: number;
  mechanicId?: number;
  userLatitude: number;
  userLongitude: number;
  vehicleType: string;
  problemDescription: string;
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
  preferredTime?: Date;
  contactPhone?: string;
  additionalNotes?: string;
}

export interface BookingResponse {
  booking: Booking;
  estimatedArrival?: string;
  mechanicContact?: string;
  totalCost?: number;
  serviceDetails?: string;
}

export interface BookingHistory {
  bookings: Booking[];
  totalCount: number;
  completedCount: number;
  totalSpent?: number;
  averageRating?: number;
}

export interface BookingFilter {
  status?: BookingStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  vehicleType?: string[];
  mechanicId?: number;
  userId?: number;
}

export interface BookingUpdate {
  id: number;
  status: BookingStatus;
  notes?: string;
  cost?: number;
  completionNotes?: string;
}
