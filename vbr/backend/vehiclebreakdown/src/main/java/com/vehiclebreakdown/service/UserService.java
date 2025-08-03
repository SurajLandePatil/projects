package com.vehiclebreakdown.service;

import com.vehiclebreakdown.dto.UserRegistrationDto;
import com.vehiclebreakdown.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(UserRegistrationDto userDto);
    Optional<User> loginUser(String email, String password);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();
    User updateUser(User user);
    void deleteUser(Long id);
}
