// export interface Review {
//   id: number;
//   userId: number;
//   mechanicId: number;
//   bookingId: number;
//   rating: number;
//   comment: string;
//   createdAt: Date;
//   userName?: string;
//   mechanicName?: string;
// }

// export interface ReviewRequest {
//   userId: number;
//   mechanicId: number;
//   bookingId: number;
//   rating: number;
//   comment: string;
// }
export interface Review {
  id: number;
  userId: number;
  mechanicId: number;
  bookingId: number;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  
  // Extended fields for UI
  userName?: string;
  mechanicName?: string;
  userProfileImage?: string;
  isVerified?: boolean;
  helpfulCount?: number;
  isHelpful?: boolean; // if current user marked as helpful
  response?: MechanicResponse;
  tags?: string[];
  images?: string[];
}

export interface ReviewRequest {
  userId: number;
  mechanicId: number;
  bookingId: number;
  rating: number;
  comment: string;
  tags?: string[];
  images?: File[];
  isAnonymous?: boolean;
}

export interface ReviewResponse {
  review: Review;
  mechanicUpdatedRating: number;
  totalReviews: number;
}

export interface MechanicResponse {
  id: number;
  reviewId: number;
  response: string;
  respondedAt: Date;
  isEdited?: boolean;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
  recentReviews: Review[];
  topTags: TagCount[];
  monthlyRatings: MonthlyRating[];
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface TagCount {
  tag: string;
  count: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface MonthlyRating {
  month: string;
  year: number;
  averageRating: number;
  totalReviews: number;
}

export interface ReviewStats {
  mechanicId: number;
  summary: ReviewSummary;
  trends: ReviewTrends;
  comparison: ReviewComparison;
}

export interface ReviewTrends {
  ratingTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  reviewVolumeTrend: 'INCREASING' | 'DECREASING' | 'STABLE';
  responsiveness: number; // percentage of reviews responded to
  averageResponseTime: number; // in hours
}

export interface ReviewComparison {
  industryAverage: number;
  competitorAverage: number;
  ranking: number; // among all mechanics
  percentile: number;
}

export interface ReviewFilter {
  rating?: number[];
  dateFrom?: Date;
  dateTo?: Date;
  hasComment?: boolean;
  hasImages?: boolean;
  isVerified?: boolean;
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'most_helpful';
}

export interface ReviewUpdate {
  reviewId: number;
  comment?: string;
  rating?: number;
  tags?: string[];
  editReason?: string;
}

export interface ReviewInteraction {
  reviewId: number;
  action: 'HELPFUL' | 'NOT_HELPFUL' | 'REPORT' | 'SHARE';
  userId: number;
  timestamp: Date;
}

export interface ReviewAnalytics {
  totalViews: number;
  helpfulClicks: number;
  shareCount: number;
  reportCount: number;
  conversionRate?: number; // if review led to booking
}

export const REVIEW_TAGS = {
  POSITIVE: [
    'Professional',
    'Quick Service',
    'Fair Pricing',
    'Quality Work',
    'Friendly',
    'Reliable',
    'Expert Knowledge',
    'Clean Work Area',
    'On Time',
    'Explains Issues Well'
  ],
  NEGATIVE: [
    'Late Arrival',
    'Poor Communication',
    'Overpriced',
    'Unprofessional',
    'Incomplete Work',
    'Rude Behavior',
    'Hidden Charges',
    'Poor Quality',
    'Not Available',
    'Messy Work'
  ]
};
