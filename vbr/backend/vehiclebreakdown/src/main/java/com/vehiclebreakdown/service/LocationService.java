package com.vehiclebreakdown.service;

import com.vehiclebreakdown.dto.LocationDto;

public interface LocationService {
    double calculateDistance(double lat1, double lon1, double lat2, double lon2);
    String getAddressFromCoordinates(double latitude, double longitude);
    LocationDto getCoordinatesFromAddress(String address);
    String calculateEstimatedTime(double distance, String transportMode);
    boolean isWithinServiceArea(double latitude, double longitude);
    String formatDistance(double distanceInKm);
}
