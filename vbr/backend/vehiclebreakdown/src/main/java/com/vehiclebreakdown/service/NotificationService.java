package com.vehiclebreakdown.service;

public interface NotificationService {
    void sendBookingNotification(Long mechanicId, Object bookingData);
    void sendBookingAcceptedNotification(Long userId, Object bookingData);
    void sendBookingRejectedNotification(Long userId, Object bookingData);
    void sendLocationUpdateNotification(Long userId, Object locationData);
    void sendNotificationToUser(Long userId, Object notification);
    void broadcastNotification(Object notification);
    void sendMechanicApprovalNotification(Long mechanicId, boolean approved);
    void sendBookingCompletedNotification(Long userId, Object bookingData);
}
