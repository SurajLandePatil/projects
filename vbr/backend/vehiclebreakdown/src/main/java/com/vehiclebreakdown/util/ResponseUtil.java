package com.vehiclebreakdown.util;

import java.util.HashMap;
import java.util.Map;

public class ResponseUtil {
    
    /**
     * Create success response
     */
    public static Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * Create success response with data
     */
    public static Map<String, Object> createSuccessResponse(String message, Object data) {
        Map<String, Object> response = createSuccessResponse(message);
        response.put("data", data);
        return response;
    }
    
    /**
     * Create error response
     */
    public static Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * Create error response with error code
     */
    public static Map<String, Object> createErrorResponse(String message, String errorCode) {
        Map<String, Object> response = createErrorResponse(message);
        response.put("errorCode", errorCode);
        return response;
    }
    
    /**
     * Create validation error response
     */
    public static Map<String, Object> createValidationErrorResponse(String message, Map<String, String> fieldErrors) {
        Map<String, Object> response = createErrorResponse(message);
        response.put("fieldErrors", fieldErrors);
        return response;
    }
    
    /**
     * Create pagination response
     */
    public static Map<String, Object> createPaginationResponse(Object data, int page, int size, long total) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("pagination", Map.of(
            "page", page,
            "size", size,
            "total", total,
            "totalPages", (int) Math.ceil((double) total / size)
        ));
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
