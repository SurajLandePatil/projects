package com.vehiclebreakdown.controller;

import com.vehiclebreakdown.dto.MechanicRegistrationDto;
import com.vehiclebreakdown.model.Mechanic;
import com.vehiclebreakdown.service.MechanicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/mechanics")
@CrossOrigin(origins = "*")
public class MechanicController {

    @Autowired
    private MechanicService mechanicService;

    @PostMapping("/register")
    public ResponseEntity<?> registerMechanic(@RequestBody MechanicRegistrationDto mechanicDto) {
        try {
            Mechanic mechanic = mechanicService.registerMechanic(mechanicDto);
            return ResponseEntity.ok(Map.of("success", true, "mechanic", mechanic));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginMechanic(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        
        Optional<Mechanic> mechanic = mechanicService.loginMechanic(email, password);
        if (mechanic.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "mechanic", mechanic.get()));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid credentials or not approved"));
    }

    @GetMapping("/nearest")
    public ResponseEntity<List<Mechanic>> getNearestMechanics(
            @RequestParam double latitude, 
            @RequestParam double longitude) {
        List<Mechanic> mechanics = mechanicService.getNearestMechanics(latitude, longitude);
        return ResponseEntity.ok(mechanics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMechanicById(@PathVariable Long id) {
        Optional<Mechanic> mechanic = mechanicService.getMechanicById(id);
        if (mechanic.isPresent()) {
            return ResponseEntity.ok(mechanic.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<?> updateLocation(@PathVariable Long id, @RequestBody Map<String, Double> location) {
        mechanicService.updateMechanicLocation(id, location.get("latitude"), location.get("longitude"));
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> availability) {
        mechanicService.updateMechanicAvailability(id, availability.get("available"));
        return ResponseEntity.ok(Map.of("success", true));
    }
}
