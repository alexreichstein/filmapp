package com.alexreichstein.filmapp.dto;

import jakarta.validation.constraints.NotBlank;

// Datan som appen skickar vid inloggning.
// Här kontrolleras bara att fälten inte är tomma.
// Längdkraven gäller vid registrering, inte vid inloggning
public record LoginRequest(

    @NotBlank(message = "Användarnamn måste anges")
    String username,

    @NotBlank(message = "Lösenord måste anges")
    String password
) {
}