package com.vehiclebreakdown.repository;

import com.vehiclebreakdown.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMechanicId(Long mechanicId);
    List<Review> findByUserId(Long userId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.mechanicId = :mechanicId")
    Double getAverageRatingForMechanic(@Param("mechanicId") Long mechanicId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.mechanicId = :mechanicId")
    Long getTotalReviewsForMechanic(@Param("mechanicId") Long mechanicId);
}
