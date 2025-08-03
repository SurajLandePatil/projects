package com.vehiclebreakdown.controller;

import com.vehiclebreakdown.dto.ReviewDto;
import com.vehiclebreakdown.model.Review;
import com.vehiclebreakdown.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDto reviewDto) {
        try {
            Review review = reviewService.createReview(reviewDto);
            return ResponseEntity.ok(Map.of("success", true, "review", review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReviewById(@PathVariable Long id) {
        Optional<Review> review = reviewService.getReviewById(id);
        if (review.isPresent()) {
            return ResponseEntity.ok(review.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/mechanic/{mechanicId}")
    public ResponseEntity<List<Review>> getReviewsByMechanicId(@PathVariable Long mechanicId) {
        return ResponseEntity.ok(reviewService.getReviewsByMechanicId(mechanicId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }

    @GetMapping("/mechanic/{mechanicId}/average")
    public ResponseEntity<?> getAverageRatingForMechanic(@PathVariable Long mechanicId) {
        Double averageRating = reviewService.getAverageRatingForMechanic(mechanicId);
        Long totalReviews = reviewService.getTotalReviewsForMechanic(mechanicId);
        
        return ResponseEntity.ok(Map.of(
            "averageRating", averageRating != null ? averageRating : 0.0,
            "totalReviews", totalReviews != null ? totalReviews : 0
        ));
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody ReviewDto reviewDto) {
        try {
            Review updatedReview = reviewService.updateReview(id, reviewDto);
            return ResponseEntity.ok(Map.of("success", true, "review", updatedReview));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
 // Add to ReviewController.java
    @GetMapping("/mechanic/{mechanicId}/count")
    public ResponseEntity<Long> getTotalReviewsForMechanic(@PathVariable Long mechanicId) {
        Long count = reviewService.getTotalReviewsForMechanic(mechanicId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/mechanic/{mechanicId}/summary")
    public ResponseEntity<?> getReviewSummary(@PathVariable Long mechanicId) {
        Map<String, Object> summary = reviewService.getReviewSummary(mechanicId);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/{reviewId}/helpful")
    public ResponseEntity<?> markReviewHelpful(@PathVariable Long reviewId) {
        reviewService.markReviewHelpful(reviewId);
        return ResponseEntity.ok(Map.of("success", true));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Review deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
