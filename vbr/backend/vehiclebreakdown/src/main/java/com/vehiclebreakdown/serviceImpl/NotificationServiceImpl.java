package com.vehiclebreakdown.serviceImpl;

import com.vehiclebreakdown.service.NotificationService;
import com.vehiclebreakdown.websocket.NotificationWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationWebSocketHandler webSocketHandler;

    @Override
    public void sendBookingNotification(Long mechanicId, Object bookingData) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "BOOKING_REQUEST");
        notification.put("mechanicId", mechanicId);
        notification.put("bookingData", bookingData);
        notification.put("timestamp", LocalDateTime.now());
        notification.put("message", "New booking request received!");
        
        webSocketHandler.sendNotificationToUser(mechanicId.toString(), notification);
    }

    @Override
    public void sendBookingAcceptedNotification(Long userId, Object bookingData) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "BOOKING_ACCEPTED");
        notification.put("userId", userId);
        notification.put("bookingData", bookingData);
        notification.put("timestamp", LocalDateTime.now());
        notification.put("message", "Your booking has been accepted by a mechanic!");
        
        webSocketHandler.sendNotificationToUser(userId.toString(), notification);
    }

    @Override
    public void sendBookingRejectedNotification(Long userId, Object bookingData) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "BOOKING_REJECTED");
        notification.put("userId", userId);
        notification.put("bookingData", bookingData);
        notification.put("timestamp", LocalDateTime.now());
        notification.put("message", "Your booking was rejected. Please try another mechanic.");
        
        webSocketHandler.sendNotificationToUser(userId.toString(), notification);
    }

    @Override
    public void sendLocationUpdateNotification(Long userId, Object locationData) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "LOCATION_UPDATE");
        notification.put("userId", userId);
        notification.put("locationData", locationData);
        notification.put("timestamp", LocalDateTime.now());
        notification.put("message", "Mechanic location updated");
        
        webSocketHandler.sendNotificationToUser(userId.toString(), notification);
    }

    @Override
    public void sendNotificationToUser(Long userId, Object notification) {
        webSocketHandler.sendNotificationToUser(userId.toString(), notification);
    }

    @Override
    public void broadcastNotification(Object notification) {
        webSocketHandler.broadcastNotification(notification);
    }

    @Override
    public void sendMechanicApprovalNotification(Long mechanicId, boolean approved) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", approved ? "MECHANIC_APPROVED" : "MECHANIC_REJECTED");
        notification.put("mechanicId", mechanicId);
        notification.put("timestamp", LocalDateTime.now());
        notification.put("message", approved ? 
            "Congratulations! Your mechanic profile has been approved." :
            "Your mechanic profile was not approved. Please reapply with correct details.");
        
        webSocketHandler.sendNotificationToUser(mechanicId.toString(), notification);
    }

    @Override
    public void sendBookingCompletedNotification(Long userId, Object bookingData) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "BOOKING_COMPLETED");
        notification.put("userId", userId);
        notification.put("bookingData", bookingData);
        notification.put("timestamp", LocalDateTime.now());
        notification.put("message", "Your booking has been completed. Please rate the mechanic.");
        
        webSocketHandler.sendNotificationToUser(userId.toString(), notification);
    }
}
