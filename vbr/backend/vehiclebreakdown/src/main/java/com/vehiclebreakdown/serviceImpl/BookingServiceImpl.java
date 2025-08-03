package com.vehiclebreakdown.serviceImpl;

import com.vehiclebreakdown.dto.BookingRequestDto;
import com.vehiclebreakdown.model.Booking;
import com.vehiclebreakdown.repository.BookingRepository;
import com.vehiclebreakdown.service.BookingService;
import com.vehiclebreakdown.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Override
    public Booking createBooking(BookingRequestDto bookingDto) {
        Booking booking = new Booking();
        booking.setUserId(bookingDto.getUserId());
        booking.setUserLatitude(bookingDto.getUserLatitude());
        booking.setUserLongitude(bookingDto.getUserLongitude());
        booking.setVehicleType(bookingDto.getVehicleType());
        booking.setProblemDescription(bookingDto.getProblemDescription());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send notification to mechanic if specified
        if (bookingDto.getMechanicId() != null) {
            savedBooking.setMechanicId(bookingDto.getMechanicId());
            bookingRepository.save(savedBooking);
            notificationService.sendBookingNotification(bookingDto.getMechanicId(), savedBooking);
        }
        
        return savedBooking;
    }

    @Override
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public List<Booking> getBookingsByMechanicId(Long mechanicId) {
        return bookingRepository.findByMechanicId(mechanicId);
    }

    @Override
    public List<Booking> getPendingBookingsForMechanic(Long mechanicId) {
        return bookingRepository.findByMechanicIdAndStatus(mechanicId, Booking.BookingStatus.PENDING);
    }

    @Override
    public Booking acceptBooking(Long bookingId, Long mechanicId) {
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isPresent() && booking.get().getStatus() == Booking.BookingStatus.PENDING) {
            booking.get().setStatus(Booking.BookingStatus.ACCEPTED);
            booking.get().setAcceptedAt(LocalDateTime.now());
            
            // Send notification to user that booking was accepted
            Booking savedBooking = bookingRepository.save(booking.get());
            notificationService.sendBookingAcceptedNotification(savedBooking.getUserId(), savedBooking);
            
            return savedBooking;
        }
        throw new RuntimeException("Booking not found or already processed");
    }

    @Override
    public Booking rejectBooking(Long bookingId, String reason) {
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isPresent()) {
            Booking b = booking.get();
            b.setStatus(Booking.BookingStatus.REJECTED);
            b.setRejectedReason(reason);          // <<< Store the reason!
            Booking savedBooking = bookingRepository.save(b);

            // Send notification to user that booking was rejected
            notificationService.sendBookingRejectedNotification(savedBooking.getUserId(), savedBooking);

            return savedBooking;
        }
        throw new RuntimeException("Booking not found");
    }


    @Override
    public Booking updateBookingStatus(Long bookingId, Booking.BookingStatus status) {
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isPresent()) {
            booking.get().setStatus(status);
            if (status == Booking.BookingStatus.COMPLETED) {
                booking.get().setCompletedAt(LocalDateTime.now());
                // Send notification to user that booking is completed
                notificationService.sendBookingCompletedNotification(booking.get().getUserId(), booking.get());
            }
            return bookingRepository.save(booking.get());
        }
        throw new RuntimeException("Booking not found");
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Missing method implementation
    @Override
    public void cancelBooking(Long bookingId) {
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isPresent()) {
            booking.get().setStatus(Booking.BookingStatus.CANCELLED);
            bookingRepository.save(booking.get());
        } else {
            throw new RuntimeException("Booking not found");
        }
    }

    // Missing method implementation
    @Override
    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
}
