package com.alexreichstein.filmapp.dto;

// Svaret vid lyckad inloggning.
// Blir till JSON: { "token": "eyJ...", "username": "alex" }
// Användarnamnet skickas med så att appen kan visa vem som är inloggad
public record AuthResponse(String token, String username) {
}