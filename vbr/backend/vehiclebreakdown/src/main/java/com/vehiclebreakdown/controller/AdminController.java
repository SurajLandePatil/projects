package com.vehiclebreakdown.controller;

import com.vehiclebreakdown.model.Admin;
import com.vehiclebreakdown.model.Mechanic;
import com.vehiclebreakdown.model.Report;
import com.vehiclebreakdown.service.AdminService;
import com.vehiclebreakdown.service.MechanicService;
import com.vehiclebreakdown.service.ReportService;
import com.vehiclebreakdown.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private MechanicService mechanicService;
    
    @Autowired
    private ReportService reportService;

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        
        Optional<Admin> admin = adminService.loginAdmin(email, password);
        if (admin.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "admin", admin.get()));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid credentials"));
    }

    @GetMapping("/mechanics/pending")
    public ResponseEntity<List<Mechanic>> getPendingMechanics() {
        return ResponseEntity.ok(mechanicService.getPendingMechanics());
    }

    @GetMapping("/mechanics/approved")
    public ResponseEntity<List<Mechanic>> getApprovedMechanics() {
        return ResponseEntity.ok(mechanicService.getApprovedMechanics());
    }

    @PostMapping("/mechanics/{id}/approve")
    public ResponseEntity<?> approveMechanic(@PathVariable Long id) {
        try {
            mechanicService.approveMechanic(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Mechanic approved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }


    @PostMapping("/mechanics/{id}/reject")
    public ResponseEntity<?> rejectMechanic(@PathVariable Long id) {
        try {
            mechanicService.rejectMechanic(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Mechanic rejected successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/reports/pending")
    public ResponseEntity<List<Report>> getPendingReports() {
        return ResponseEntity.ok(reportService.getReportsByStatus(Report.ReportStatus.PENDING));
    }

    @PostMapping("/reports/{id}/resolve")
    public ResponseEntity<?> resolveReport(@PathVariable Long id, @RequestBody Map<String, String> data) {
        try {
            String action = data.get("action"); // "resolve" or "dismiss"
            if ("resolve".equals(action)) {
                reportService.resolveReport(id);
                return ResponseEntity.ok(Map.of("success", true, "message", "Report resolved successfully"));
            } else if ("dismiss".equals(action)) {
                reportService.dismissReport(id);
                return ResponseEntity.ok(Map.of("success", true, "message", "Report dismissed successfully"));
            }
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid action"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
