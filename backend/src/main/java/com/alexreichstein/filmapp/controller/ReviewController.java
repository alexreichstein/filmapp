package com.alexreichstein.filmapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alexreichstein.filmapp.dto.CreateReviewRequest;
import com.alexreichstein.filmapp.dto.MessageResponse;
import com.alexreichstein.filmapp.dto.ReviewResponse;
import com.alexreichstein.filmapp.dto.UpdateReviewRequest;
import com.alexreichstein.filmapp.service.ReviewService;

import jakarta.validation.Valid;

// Endpoints för recensioner.
// Adresserna börjar på olika sätt, så här anges bara "/api" gemensamt
@RestController
@RequestMapping("/api")
public class ReviewController {

    // Servicen med logiken för recensioner
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // GET /api/movies/{movieId}/reviews
    // Öppen för alla: recensionerna för en film
    @GetMapping("/movies/{movieId}/reviews")
    public List<ReviewResponse> getReviewsForMovie(@PathVariable Long movieId) {
        return reviewService.getReviewsForMovie(movieId);
    }

    // POST /api/movies/{movieId}/reviews
    // Kräver inloggning: skriver en ny recension.
    // @AuthenticationPrincipal hämtar användarnamnet från token
    @PostMapping("/movies/{movieId}/reviews")
    public ResponseEntity<ReviewResponse> createReview(@PathVariable Long movieId,
                                                       @AuthenticationPrincipal String username,
                                                       @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse response = reviewService.createReview(movieId, username, request);

        // 201 Created: en ny recension har skapats
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PATCH /api/reviews/{id}
    // Kräver inloggning och att användaren äger recensionen
    @PatchMapping("/reviews/{id}")
    public ReviewResponse updateReview(@PathVariable Long id,
                                       @AuthenticationPrincipal String username,
                                       @Valid @RequestBody UpdateReviewRequest request) {
        return reviewService.updateReview(id, username, request);
    }

    // DELETE /api/reviews/{id}
    // Kräver inloggning och att användaren äger recensionen.
    // Svarar med ett meddelande så att appen kan visa tydlig återkoppling (US12)
    @DeleteMapping("/reviews/{id}")
    public MessageResponse deleteReview(@PathVariable Long id,
                                        @AuthenticationPrincipal String username) {
        reviewService.deleteReview(id, username);
        return new MessageResponse("Recensionen har tagits bort");
    }

    // GET /api/users/me/reviews
    // Kräver inloggning: den inloggade användarens recensioner (grund för VG6)
    @GetMapping("/users/me/reviews")
    public List<ReviewResponse> getMyReviews(@AuthenticationPrincipal String username) {
        return reviewService.getMyReviews(username);
    }
}