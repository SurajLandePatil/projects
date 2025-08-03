package com.vehiclebreakdown.serviceImpl;

import com.vehiclebreakdown.dto.LocationDto;
import com.vehiclebreakdown.service.LocationService;
import org.springframework.stereotype.Service;

@Service
public class LocationServiceImpl implements LocationService {

    private static final double EARTH_RADIUS_KM = 6371.0;
    private static final double SERVICE_RADIUS_KM = 50.0; // 50km service area

    @Override
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    @Override
    public String getAddressFromCoordinates(double latitude, double longitude) {
        // In a real application, you would use a geocoding service like Google Maps API
        // For now, returning a placeholder
        return String.format("Location at %.6f, %.6f", latitude, longitude);
    }

    @Override
    public LocationDto getCoordinatesFromAddress(String address) {
        // In a real application, you would use a geocoding service
        // For now, returning a placeholder
        LocationDto location = new LocationDto();
        location.setLatitude(0.0);
        location.setLongitude(0.0);
        location.setAddress(address);
        return location;
    }

    @Override
    public String calculateEstimatedTime(double distance, String transportMode) {
        double speed; // km/h
        switch (transportMode.toLowerCase()) {
            case "car":
                speed = 40.0; // Average city speed
                break;
            case "bike":
                speed = 25.0;
                break;
            case "walk":
                speed = 5.0;
                break;
            default:
                speed = 40.0;
        }
        
        double timeInHours = distance / speed;
        int minutes = (int) Math.round(timeInHours * 60);
        
        if (minutes < 60) {
            return minutes + " minutes";
        } else {
            int hours = minutes / 60;
            int remainingMinutes = minutes % 60;
            return hours + " hour" + (hours > 1 ? "s" : "") + 
                   (remainingMinutes > 0 ? " " + remainingMinutes + " minutes" : "");
        }
    }

    @Override
    public boolean isWithinServiceArea(double latitude, double longitude) {
        // Define a central point for service area (you can make this configurable)
        double centralLat = 28.6139; // Delhi coordinates as example
        double centralLon = 77.2090;
        
        double distance = calculateDistance(centralLat, centralLon, latitude, longitude);
        return distance <= SERVICE_RADIUS_KM;
    }

    @Override
    public String formatDistance(double distanceInKm) {
        if (distanceInKm < 1.0) {
            int meters = (int) Math.round(distanceInKm * 1000);
            return meters + " m";
        } else {
            return String.format("%.1f km", distanceInKm);
        }
    }
}
