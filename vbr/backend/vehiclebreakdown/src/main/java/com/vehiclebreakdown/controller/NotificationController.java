package com.vehiclebreakdown.controller;

import com.vehiclebreakdown.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/booking")
    public ResponseEntity<?> sendBookingNotification(@RequestBody Map<String, Object> notificationData) {
        try {
            Long mechanicId = Long.valueOf(notificationData.get("mechanicId").toString());
            Object bookingData = notificationData.get("bookingData");
            
            notificationService.sendBookingNotification(mechanicId, bookingData);
            return ResponseEntity.ok(Map.of("success", true, "message", "Notification sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/booking-accepted")
    public ResponseEntity<?> sendBookingAcceptedNotification(@RequestBody Map<String, Object> notificationData) {
        try {
            Long userId = Long.valueOf(notificationData.get("userId").toString());
            Object bookingData = notificationData.get("bookingData");
            
            notificationService.sendBookingAcceptedNotification(userId, bookingData);
            return ResponseEntity.ok(Map.of("success", true, "message", "Notification sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/location-update")
    public ResponseEntity<?> sendLocationUpdateNotification(@RequestBody Map<String, Object> notificationData) {
        try {
            Long userId = Long.valueOf(notificationData.get("userId").toString());
            Object locationData = notificationData.get("locationData");
            
            notificationService.sendLocationUpdateNotification(userId, locationData);
            return ResponseEntity.ok(Map.of("success", true, "message", "Location update sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcastNotification(@RequestBody Map<String, Object> notificationData) {
        try {
            notificationService.broadcastNotification(notificationData);
            return ResponseEntity.ok(Map.of("success", true, "message", "Broadcast notification sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/test/{userId}")
    public ResponseEntity<?> testNotification(@PathVariable Long userId) {
        try {
            Map<String, Object> testData = Map.of(
                "type", "test",
                "message", "This is a test notification",
                "timestamp", System.currentTimeMillis()
            );
            notificationService.sendNotificationToUser(userId, testData);
            return ResponseEntity.ok(Map.of("success", true, "message", "Test notification sent"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
