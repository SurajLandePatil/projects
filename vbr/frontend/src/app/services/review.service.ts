import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review, ReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Create a new review
  createReview(reviewData: ReviewRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews`, reviewData);
  }

  // Get review by ID
  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/reviews/${id}`);
  }

  // Get reviews by mechanic ID
  getReviewsByMechanicId(mechanicId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/mechanic/${mechanicId}`);
  }

  // Get reviews by user ID
  getReviewsByUserId(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/user/${userId}`);
  }

  // Get average rating for mechanic
  getAverageRatingForMechanic(mechanicId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews/mechanic/${mechanicId}/average`);
  }

  // Get total reviews count for mechanic
  getTotalReviewsForMechanic(mechanicId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/reviews/mechanic/${mechanicId}/count`);
  }

  // Get all reviews (admin only)
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews`);
  }

  // Update review
  updateReview(id: number, reviewData: Partial<ReviewRequest>): Observable<any> {
    return this.http.put(`${this.apiUrl}/reviews/${id}`, reviewData);
  }

  // Delete review
  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reviews/${id}`);
  }

  // Get review summary for mechanic
  getReviewSummary(mechanicId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews/mechanic/${mechanicId}/summary`);
  }

  // Mark review as helpful
  markReviewHelpful(reviewId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews/${reviewId}/helpful`, {});
  }

  // Report review
  reportReview(reviewId: number, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews/${reviewId}/report`, { reason });
  }

  // Get reviews with filters
  getFilteredReviews(filters: any): Observable<Review[]> {
    return this.http.post<Review[]>(`${this.apiUrl}/reviews/filter`, filters);
  }
}
