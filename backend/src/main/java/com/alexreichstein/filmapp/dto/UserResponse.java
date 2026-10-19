package com.alexreichstein.filmapp.dto;

// Information om den inloggade användaren.
// Blir till JSON: { "username": "alex" }
public record UserResponse(String username) {
}