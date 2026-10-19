package com.alexreichstein.filmapp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Datan som appen skickar när en ny recension skapas
public record CreateReviewRequest(

    // Betyget är obligatoriskt och ska vara mellan 1 och 10
    @NotNull(message = "Betyg måste anges")
    @Min(value = 1, message = "Betyget ska vara mellan 1 och 10")
    @Max(value = 10, message = "Betyget ska vara mellan 1 och 10")
    Integer rating,

    // Texten är valfri men får vara max 1000 tecken
    @Size(max = 1000, message = "Texten får vara max 1000 tecken")
    String text
) {
}