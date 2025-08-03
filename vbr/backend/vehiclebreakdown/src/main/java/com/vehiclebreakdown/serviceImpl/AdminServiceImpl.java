package com.vehiclebreakdown.serviceImpl;

import com.vehiclebreakdown.model.Admin;
import com.vehiclebreakdown.model.Booking;
import com.vehiclebreakdown.model.Mechanic;
import com.vehiclebreakdown.model.Report;
import com.vehiclebreakdown.model.User;
import com.vehiclebreakdown.repository.AdminRepository;
import com.vehiclebreakdown.repository.BookingRepository;
import com.vehiclebreakdown.repository.MechanicRepository;
import com.vehiclebreakdown.repository.ReportRepository;
import com.vehiclebreakdown.repository.UserRepository;
import com.vehiclebreakdown.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MechanicRepository mechanicRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private ReportRepository reportRepository;

    @Override
    public Optional<Admin> loginAdmin(String email, String password) {
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return admin;
        }
        return Optional.empty();
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);
        
        // Mechanic statistics
        long totalMechanics = mechanicRepository.count();
        long approvedMechanics = mechanicRepository.findByIsApprovedTrue().size();
        long pendingMechanics = mechanicRepository.findByIsApprovedFalse().size();
        stats.put("totalMechanics", totalMechanics);
        stats.put("approvedMechanics", approvedMechanics);
        stats.put("pendingMechanics", pendingMechanics);
        
        // Booking statistics
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.findByStatus(Booking.BookingStatus.PENDING).size();
        long completedBookings = bookingRepository.findByStatus(Booking.BookingStatus.COMPLETED).size();
        stats.put("totalBookings", totalBookings);
        stats.put("pendingBookings", pendingBookings);
        stats.put("completedBookings", completedBookings);
        
        // Report statistics
        long totalReports = reportRepository.count();
        long pendingReports = reportRepository.findByStatus(Report.ReportStatus.PENDING).size();
        stats.put("totalReports", totalReports);
        stats.put("pendingReports", pendingReports);
        
        return stats;
    }
}
