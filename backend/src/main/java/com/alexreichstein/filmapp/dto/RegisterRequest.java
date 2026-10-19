package com.alexreichstein.filmapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Datan som appen skickar vid registrering.
// Ett record skapar konstruktor och getters automatiskt.
// Annoteringarna kontrollerar att datan är giltig innan vi använder den.
public record RegisterRequest(

    // Användarnamnet får inte vara tomt och ska vara 3–30 tecken
    @NotBlank(message = "Användarnamn måste anges")
    @Size(min = 3, max = 30, message = "Användarnamnet ska vara 3–30 tecken")
    String username,

    // Lösenordet får inte vara tomt och ska vara minst 6 tecken
    @NotBlank(message = "Lösenord måste anges")
    @Size(min = 6, message = "Lösenordet ska vara minst 6 tecken")
    String password
) {
}