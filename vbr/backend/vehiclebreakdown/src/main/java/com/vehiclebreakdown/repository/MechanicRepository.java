package com.vehiclebreakdown.repository;

import com.vehiclebreakdown.model.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long> {
    Optional<Mechanic> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Mechanic> findByIsApprovedTrue();
    List<Mechanic> findByIsApprovedFalse();
    List<Mechanic> findByIsApprovedTrueAndIsAvailableTrue();
    
    @Query("SELECT m FROM Mechanic m WHERE m.isApproved = true AND m.isAvailable = true " +
           "ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(m.currentLatitude)) * " +
           "cos(radians(m.currentLongitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(m.currentLatitude))))")
    List<Mechanic> findNearestMechanics(@Param("latitude") double latitude, 
                                       @Param("longitude") double longitude);
}
