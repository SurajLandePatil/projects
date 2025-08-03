package com.vehiclebreakdown.serviceImpl;

import com.vehiclebreakdown.dto.MechanicRegistrationDto;
import com.vehiclebreakdown.model.Mechanic;
import com.vehiclebreakdown.repository.MechanicRepository;
import com.vehiclebreakdown.service.MechanicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MechanicServiceImpl implements MechanicService {

    @Autowired
    private MechanicRepository mechanicRepository;

    @Override
    public Mechanic registerMechanic(MechanicRegistrationDto mechanicDto) {
        if (mechanicRepository.existsByEmail(mechanicDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        Mechanic mechanic = new Mechanic();
        mechanic.setName(mechanicDto.getName());
        mechanic.setEmail(mechanicDto.getEmail());
        mechanic.setPassword(mechanicDto.getPassword());
        mechanic.setPhone(mechanicDto.getPhone());
        mechanic.setShopName(mechanicDto.getShopName());
        mechanic.setShopAddress(mechanicDto.getShopAddress());
        mechanic.setExperience(mechanicDto.getExperience());
        mechanic.setSpecialization(mechanicDto.getSpecialization());
        mechanic.setLatitude(mechanicDto.getLatitude());
        mechanic.setLongitude(mechanicDto.getLongitude());
        mechanic.setCurrentLatitude(mechanicDto.getLatitude());
        mechanic.setCurrentLongitude(mechanicDto.getLongitude());
        mechanic.setApproved(false);
        mechanic.setAvailable(true);
        mechanic.setCreatedAt(LocalDateTime.now());
        
        return mechanicRepository.save(mechanic);
    }

    @Override
    public Optional<Mechanic> loginMechanic(String email, String password) {
        Optional<Mechanic> mechanic = mechanicRepository.findByEmail(email);
        if (mechanic.isPresent() && mechanic.get().getPassword().equals(password) && mechanic.get().isApproved()) {
            return mechanic;
        }
        return Optional.empty();
    }

    @Override
    public Optional<Mechanic> getMechanicById(Long id) {
        return mechanicRepository.findById(id);
    }

    @Override
    public List<Mechanic> getAllMechanics() {
        return mechanicRepository.findAll();
    }

    @Override
    public List<Mechanic> getApprovedMechanics() {
        return mechanicRepository.findByIsApprovedTrue();
    }

    @Override
    public List<Mechanic> getPendingMechanics() {
        return mechanicRepository.findByIsApprovedFalse();
    }

    @Override
    public List<Mechanic> getNearestMechanics(double latitude, double longitude) {
        return mechanicRepository.findNearestMechanics(latitude, longitude);
    }

    @Override
    public Mechanic updateMechanic(Mechanic mechanic) {
        return mechanicRepository.save(mechanic);
    }

    @Override
    public void approveMechanic(Long mechanicId) {
        Optional<Mechanic> mechanic = mechanicRepository.findById(mechanicId);
        if (mechanic.isPresent()) {
            mechanic.get().setApproved(true);
            mechanicRepository.save(mechanic.get());
        }
    }

    @Override
    public void rejectMechanic(Long mechanicId) {
        mechanicRepository.deleteById(mechanicId);
    }

    @Override
    public void updateMechanicLocation(Long mechanicId, double latitude, double longitude) {
        Optional<Mechanic> mechanic = mechanicRepository.findById(mechanicId);
        if (mechanic.isPresent()) {
            mechanic.get().setCurrentLatitude(latitude);
            mechanic.get().setCurrentLongitude(longitude);
            mechanicRepository.save(mechanic.get());
        }
    }

    @Override
    public void updateMechanicAvailability(Long mechanicId, boolean available) {
        Optional<Mechanic> mechanic = mechanicRepository.findById(mechanicId);
        if (mechanic.isPresent()) {
            mechanic.get().setAvailable(available);
            mechanicRepository.save(mechanic.get());
        }
    }
}
