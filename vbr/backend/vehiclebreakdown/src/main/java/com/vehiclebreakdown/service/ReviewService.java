package com.vehiclebreakdown.service;

import com.vehiclebreakdown.dto.ReviewDto;
import com.vehiclebreakdown.model.Review;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ReviewService {
    Review createReview(ReviewDto reviewDto);
    Optional<Review> getReviewById(Long id);
    List<Review> getReviewsByMechanicId(Long mechanicId);
    List<Review> getReviewsByUserId(Long userId);
    Double getAverageRatingForMechanic(Long mechanicId);
    Long getTotalReviewsForMechanic(Long mechanicId);
    List<Review> getAllReviews();
    Review updateReview(Long id, ReviewDto reviewDto);
    void deleteReview(Long id);
    
    
    Map<String, Object> getReviewSummary(Long mechanicId);
    void markReviewHelpful(Long reviewId);
}
