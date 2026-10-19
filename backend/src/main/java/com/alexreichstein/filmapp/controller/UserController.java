package com.alexreichstein.filmapp.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alexreichstein.filmapp.dto.UserResponse;

// Endpoints som gäller den inloggade användaren
@RestController
@RequestMapping("/api/users")
public class UserController {

    // GET /api/users/me
    // Skyddad adress: kräver giltig token.
    // @AuthenticationPrincipal hämtar användarnamnet som JwtAuthenticationFilter sparade
    @GetMapping("/me")
    public UserResponse getCurrentUser(@AuthenticationPrincipal String username) {
        return new UserResponse(username);
    }
}