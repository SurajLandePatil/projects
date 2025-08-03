package com.vehiclebreakdown.serviceImpl;

import com.vehiclebreakdown.dto.ReviewDto;
import com.vehiclebreakdown.model.Review;
import com.vehiclebreakdown.repository.ReviewRepository;
import com.vehiclebreakdown.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review createReview(ReviewDto reviewDto) {
        Review review = new Review();
        review.setUserId(reviewDto.getUserId());
        review.setMechanicId(reviewDto.getMechanicId());
        review.setBookingId(reviewDto.getBookingId());
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        review.setCreatedAt(LocalDateTime.now());
        
        return reviewRepository.save(review);
    }

    @Override
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    @Override
    public List<Review> getReviewsByMechanicId(Long mechanicId) {
        return reviewRepository.findByMechanicId(mechanicId);
    }

    @Override
    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Override
    public Double getAverageRatingForMechanic(Long mechanicId) {
        return reviewRepository.getAverageRatingForMechanic(mechanicId);
    }

    @Override
    public Long getTotalReviewsForMechanic(Long mechanicId) {
        return reviewRepository.getTotalReviewsForMechanic(mechanicId);
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public Review updateReview(Long id, ReviewDto reviewDto) {
        Optional<Review> existingReview = reviewRepository.findById(id);
        if (existingReview.isPresent()) {
            Review review = existingReview.get();
            review.setRating(reviewDto.getRating());
            review.setComment(reviewDto.getComment());
            return reviewRepository.save(review);
        }
        throw new RuntimeException("Review not found with id: " + id);
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
    @Override
    public Map<String, Object> getReviewSummary(Long mechanicId) {
        Double avgRating = reviewRepository.getAverageRatingForMechanic(mechanicId);
        Long count = reviewRepository.getTotalReviewsForMechanic(mechanicId);
        Map<String, Object> summary = new HashMap<>();
        summary.put("averageRating", avgRating != null ? avgRating : 0.0);
        summary.put("totalReviews", count != null ? count : 0);
        return summary;
    }
    @Override
    public void markReviewHelpful(Long reviewId) {
        Optional<Review> optionalReview = reviewRepository.findById(reviewId);
        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();
            int currentCount = review.getHelpfulCount() != null ? review.getHelpfulCount() : 0;
            review.setHelpfulCount(currentCount + 1);
            reviewRepository.save(review);
        } else {
            throw new RuntimeException("Review not found with id: " + reviewId);
        }
    }


    
}
