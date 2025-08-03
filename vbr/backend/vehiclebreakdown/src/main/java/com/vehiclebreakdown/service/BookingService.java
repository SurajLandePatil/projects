package com.vehiclebreakdown.service;

import com.vehiclebreakdown.dto.BookingRequestDto;
import com.vehiclebreakdown.model.Booking;

import java.util.List;
import java.util.Optional;

public interface BookingService {
    Booking createBooking(BookingRequestDto bookingDto);
    Optional<Booking> getBookingById(Long id);
    List<Booking> getBookingsByUserId(Long userId);
    List<Booking> getBookingsByMechanicId(Long mechanicId);
    List<Booking> getPendingBookingsForMechanic(Long mechanicId);
    Booking acceptBooking(Long bookingId, Long mechanicId);
    Booking rejectBooking(Long bookingId, String reason);

    Booking updateBookingStatus(Long bookingId, Booking.BookingStatus status);
    List<Booking> getAllBookings();
    void cancelBooking(Long bookingId);
    List<Booking> getBookingsByStatus(Booking.BookingStatus status);
}
