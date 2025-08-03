package com.vehiclebreakdown.service;

import com.vehiclebreakdown.dto.MechanicRegistrationDto;
import com.vehiclebreakdown.model.Mechanic;

import java.util.List;
import java.util.Optional;

public interface MechanicService {
    Mechanic registerMechanic(MechanicRegistrationDto mechanicDto);
    Optional<Mechanic> loginMechanic(String email, String password);
    Optional<Mechanic> getMechanicById(Long id);
    List<Mechanic> getAllMechanics();
    List<Mechanic> getApprovedMechanics();
    List<Mechanic> getPendingMechanics();
    List<Mechanic> getNearestMechanics(double latitude, double longitude);
    Mechanic updateMechanic(Mechanic mechanic);
    void approveMechanic(Long mechanicId);
    void rejectMechanic(Long mechanicId);
    void updateMechanicLocation(Long mechanicId, double latitude, double longitude);
    void updateMechanicAvailability(Long mechanicId, boolean available);
}
