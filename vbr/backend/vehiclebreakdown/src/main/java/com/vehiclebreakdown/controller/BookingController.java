package com.vehiclebreakdown.controller;

import com.vehiclebreakdown.dto.BookingRequestDto;
import com.vehiclebreakdown.model.Booking;
import com.vehiclebreakdown.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDto bookingDto) {
        try {
            Booking booking = bookingService.createBooking(bookingDto);
            return ResponseEntity.ok(Map.of("success", true, "booking", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @GetMapping("/mechanic/{mechanicId}")
    public ResponseEntity<List<Booking>> getMechanicBookings(@PathVariable Long mechanicId) {
        return ResponseEntity.ok(bookingService.getBookingsByMechanicId(mechanicId));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptBooking(@PathVariable Long id, @RequestBody Map<String, Long> data) {
        try {
            Booking booking = bookingService.acceptBooking(id, data.get("mechanicId"));
            return ResponseEntity.ok(Map.of("success", true, "booking", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String reason = body.get("reason");
            Booking booking = bookingService.rejectBooking(id, reason);
            return ResponseEntity.ok(Map.of("success", true, "booking", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }



    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            Booking.BookingStatus status = Booking.BookingStatus.valueOf(statusData.get("status"));
            Booking booking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(Map.of("success", true, "booking", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
