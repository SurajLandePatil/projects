package com.vehiclebreakdown.service;

import com.vehiclebreakdown.model.Admin;
import java.util.Map;
import java.util.Optional;

public interface AdminService {
    Optional<Admin> loginAdmin(String email, String password);
    Map<String, Object> getDashboardStats();
}
