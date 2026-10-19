package com.alexreichstein.filmapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alexreichstein.filmapp.dto.AuthResponse;
import com.alexreichstein.filmapp.dto.LoginRequest;
import com.alexreichstein.filmapp.dto.MessageResponse;
import com.alexreichstein.filmapp.dto.RegisterRequest;
import com.alexreichstein.filmapp.service.AuthService;

import jakarta.validation.Valid;

// Endpoints för registrering och inloggning
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Servicen med logiken för registrering och inloggning
    private final AuthService authService;

    // Spring skickar in AuthService automatiskt via konstruktorn
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/register
    // @RequestBody: datan kommer som JSON i anropet och görs om till en RegisterRequest
    // @Valid: kontrollerar reglerna i RegisterRequest (@NotBlank, @Size) innan metoden körs
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);

        // Svarar 201 Created, som betyder att något nytt har skapats
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponse("Kontot har skapats"));
    }

    // POST /api/auth/login
    // Kontrollerar användarnamn och lösenord och svarar med en token
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        // Svarar 200 OK med token och användarnamn
        return ResponseEntity.ok(response);
    }
}