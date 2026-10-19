package com.alexreichstein.filmapp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

// Datan som appen skickar när en recension ändras (PATCH).
// Båda fälten är valfria: det som inte skickas med lämnas oförändrat.
// Därför finns ingen @NotNull här
public record UpdateReviewRequest(

    // Om betyget skickas ska det vara mellan 1 och 10
    @Min(value = 1, message = "Betyget ska vara mellan 1 och 10")
    @Max(value = 10, message = "Betyget ska vara mellan 1 och 10")
    Integer rating,

    // Om texten skickas får den vara max 1000 tecken.
    // En tom text ("") tar bort texten från recensionen
    @Size(max = 1000, message = "Texten får vara max 1000 tecken")
    String text
) {
}