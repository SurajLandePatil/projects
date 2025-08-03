package com.vehiclebreakdown.util;

public class DistanceCalculator {
    
    private static final double EARTH_RADIUS_KM = 6371.0;
    
    /**
     * Calculate distance between two points using Haversine formula
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
    
    /**
     * Calculate distance in meters
     */
    public static double calculateDistanceInMeters(double lat1, double lon1, double lat2, double lon2) {
        return calculateDistance(lat1, lon1, lat2, lon2) * 1000;
    }
    
    /**
     * Format distance for display
     */
    public static String formatDistance(double distanceInKm) {
        if (distanceInKm < 1.0) {
            int meters = (int) Math.round(distanceInKm * 1000);
            return meters + " m";
        } else if (distanceInKm < 10.0) {
            return String.format("%.1f km", distanceInKm);
        } else {
            return String.format("%.0f km", distanceInKm);
        }
    }
    
    /**
     * Check if location is within specified radius
     */
    public static boolean isWithinRadius(double lat1, double lon1, double lat2, double lon2, double radiusKm) {
        double distance = calculateDistance(lat1, lon1, lat2, lon2);
        return distance <= radiusKm;
    }
    
    /**
     * Calculate estimated travel time based on distance and average speed
     */
    public static String calculateEstimatedTime(double distanceInKm, double averageSpeedKmh) {
        double timeInHours = distanceInKm / averageSpeedKmh;
        int totalMinutes = (int) Math.round(timeInHours * 60);
        
        if (totalMinutes < 60) {
            return totalMinutes + " min";
        } else {
            int hours = totalMinutes / 60;
            int minutes = totalMinutes % 60;
            if (minutes == 0) {
                return hours + " hr";
            } else {
                return hours + " hr " + minutes + " min";
            }
        }
    }
}
