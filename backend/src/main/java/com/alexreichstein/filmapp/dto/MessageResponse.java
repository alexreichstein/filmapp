package com.alexreichstein.filmapp.dto;

// Enkelt svar med ett meddelande, till exempel "Kontot har skapats".
// Blir till JSON: { "message": "Kontot har skapats" }
public record MessageResponse(String message) {
}