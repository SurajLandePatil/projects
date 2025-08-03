package com.vehiclebreakdown.repository;

import com.vehiclebreakdown.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByMechanicId(Long mechanicId);
    List<Booking> findByStatus(Booking.BookingStatus status);
    List<Booking> findByMechanicIdAndStatus(Long mechanicId, Booking.BookingStatus status);
}
