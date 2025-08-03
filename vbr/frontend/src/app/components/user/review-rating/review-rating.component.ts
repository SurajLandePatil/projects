import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../../services/review.service';
import { UserService } from '../../../services/user.service';
import { Mechanic } from '../../../models/mechanic.model';
import { Booking } from '../../../models/booking.model';
import { Inject } from '@angular/core';

export interface ReviewDialogData {
  mechanic: Mechanic;
  booking: Booking;
}

@Component({
  selector: 'app-review-rating',
  templateUrl: './review-rating.component.html',
  styleUrls: ['./review-rating.component.css']
})
export class ReviewRatingComponent implements OnInit {
  reviewForm!: FormGroup;
  isSubmitting = false;
  selectedRating = 0;
  hoveredRating = 0;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ReviewRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(500)]]
    });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  onMouseEnter(rating: number): void {
    this.hoveredRating = rating;
  }

  onMouseLeave(): void {
    this.hoveredRating = 0;
  }

  getStarIcon(index: number): string {
    const ratingToCheck = this.hoveredRating || this.selectedRating;
    return index <= ratingToCheck ? 'star' : 'star_border';
  }

  getStarColor(index: number): string {
    const ratingToCheck = this.hoveredRating || this.selectedRating;
    return index <= ratingToCheck ? 'star-filled' : 'star-empty';
  }

  getRatingText(): string {
    const ratings = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratings[this.selectedRating as keyof typeof ratings] || 'Select Rating';
  }

  onSubmit(): void {
    if (this.reviewForm.valid && this.selectedRating > 0) {
      this.isSubmitting = true;
      const currentUser = this.userService.getCurrentUser();
      
      if (!currentUser) {
        this.snackBar.open('User not found. Please login again.', 'Close', { duration: 3000 });
        return;
      }

      const reviewData = {
        userId: currentUser.id,
        mechanicId: this.data.mechanic.id,
        bookingId: this.data.booking.id,
        rating: this.selectedRating,
        comment: this.reviewForm.value.comment || ''
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.snackBar.open('Review submitted successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close({ success: true, review: response.review });
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(error.error?.message || 'Failed to submit review', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}
