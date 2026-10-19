package com.alexreichstein.filmapp.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.alexreichstein.filmapp.dto.AuthResponse;
import com.alexreichstein.filmapp.dto.LoginRequest;
import com.alexreichstein.filmapp.dto.RegisterRequest;
import com.alexreichstein.filmapp.model.User;
import com.alexreichstein.filmapp.repository.UserRepository;
import com.alexreichstein.filmapp.security.JwtService;

// Logiken för registrering och inloggning
@Service
public class AuthService {

    // Samma felmeddelande oavsett om användaren saknas eller lösenordet är fel,
    // så att ingen kan ta reda på vilka användarnamn som finns
    private static final String INVALID_LOGIN = "Fel användarnamn eller lösenord";

    // Repositoryt för användare
    private final UserRepository userRepository;

    // Krypterar och jämför lösenord (vår @Bean från SecurityConfig)
    private final PasswordEncoder passwordEncoder;

    // Skapar tokens
    private final JwtService jwtService;

    // Spring skickar in alla tre automatiskt via konstruktorn
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

    // Loggar in en användare och returnerar en token
    public AuthResponse login(LoginRequest request) {

        // Hämtar användaren. Finns den inte: 401 Unauthorized
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_LOGIN));

        // Jämför det inskrivna lösenordet med det krypterade i databasen.
        // matches() krypterar det inskrivna lösenordet och jämför resultaten
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_LOGIN);
        }

        // Allt stämmer: skapa en token för användaren
        String token = jwtService.generateToken(user.getUsername());

        return new AuthResponse(token, user.getUsername());
    }
}