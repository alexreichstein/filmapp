package com.alexreichstein.filmapp.dto;

import java.time.Instant;

import com.alexreichstein.filmapp.model.Review;

// Det som skickas tillbaka till appen för en recension.
// Innehåller bara användarnamnet, aldrig hela User-objektet,
// eftersom det skulle skicka med det krypterade lösenordet
public record ReviewResponse(
    Long id,
    Integer rating,
    String text,
    String username,
    Long movieId,
    String movieTitle,
    Instant createdAt,
    Instant updatedAt
) {

    // Hjälpmetod som gör om en Review från databasen till en ReviewResponse.
    // Måste anropas inne i en @Transactional-metod eftersom user och movie är LAZY
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
            review.getId(),
            review.getRating(),
            review.getText(),
            review.getUser().getUsername(),
            review.getMovie().getId(),
            review.getMovie().getTitle(),
            review.getCreatedAt(),
            review.getUpdatedAt()
        );
    }
}