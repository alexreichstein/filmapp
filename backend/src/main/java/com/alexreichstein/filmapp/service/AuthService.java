package com.alexreichstein.filmapp.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.alexreichstein.filmapp.dto.RegisterRequest;
import com.alexreichstein.filmapp.model.User;
import com.alexreichstein.filmapp.repository.UserRepository;

// Logiken för registrering, och senare även inloggning
@Service
public class AuthService {

    // Repositoryt för användare
    private final UserRepository userRepository;

    // Krypterar lösenord (vår @Bean från SecurityConfig)
    private final PasswordEncoder passwordEncoder;

    // Spring skickar in båda automatiskt via konstruktorn
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Registrerar en ny användare
    public void register(RegisterRequest request) {

        // Om namnet redan finns: avbryt med 409 Conflict
        if (userRepository.existsByUsername(request.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Användarnamnet är redan taget");
        }

        // Krypterar lösenordet innan det sparas
        String encodedPassword = passwordEncoder.encode(request.password());

        // Skapar och sparar den nya användaren
        User user = new User(request.username(), encodedPassword);
        userRepository.save(user);
    }
}