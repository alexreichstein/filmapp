package com.alexreichstein.filmapp.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.alexreichstein.filmapp.dto.CreateReviewRequest;
import com.alexreichstein.filmapp.dto.ReviewResponse;
import com.alexreichstein.filmapp.dto.UpdateReviewRequest;
import com.alexreichstein.filmapp.model.Movie;
import com.alexreichstein.filmapp.model.Review;
import com.alexreichstein.filmapp.model.User;
import com.alexreichstein.filmapp.repository.MovieRepository;
import com.alexreichstein.filmapp.repository.ReviewRepository;
import com.alexreichstein.filmapp.repository.UserRepository;

// Logiken för recensioner: hämta, skapa, ändra och ta bort
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    // Spring skickar in alla tre repositories automatiskt via konstruktorn
    public ReviewService(ReviewRepository reviewRepository,
                         MovieRepository movieRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    // Hämtar alla recensioner för en film, nyaste först.
    // readOnly = true talar om att metoden bara läser, vilket gör den lite snabbare
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForMovie(Long movieId) {

        // Om filmen inte finns: 404. En tom lista betyder istället
        // "filmen finns men har inga recensioner", vilket inte är ett fel
        if (!movieRepository.existsById(movieId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Filmen hittades inte");
        }

        return reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    // Hämtar alla recensioner som den inloggade användaren har skrivit
    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyReviews(String username) {
        return reviewRepository.findByUserUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(ReviewResponse::from)
                .toList();
    }

    // Skapar en ny recension för en film
    @Transactional
    public ReviewResponse createReview(Long movieId, String username, CreateReviewRequest request) {

        // Filmen måste finnas
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Filmen hittades inte"));

        // Hämtar den inloggade användaren
        User user = findUser(username);

        // En recension per användare och film
        if (reviewRepository.existsByUserIdAndMovieId(user.getId(), movieId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Du har redan recenserat den här filmen");
        }

        // Skapar och sparar recensionen
        Review review = new Review(request.rating(), cleanText(request.text()), movie, user);
        Review saved = reviewRepository.save(review);

        return ReviewResponse.from(saved);
    }

    // Ändrar en befintlig recension. Bara det som skickas med ändras
    @Transactional
    public ReviewResponse updateReview(Long reviewId, String username, UpdateReviewRequest request) {

        // Hämtar recensionen och kontrollerar att användaren äger den
        Review review = findOwnReview(reviewId, username);

        // Om inget fält skickades finns inget att ändra
        if (request.rating() == null && request.text() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inget att uppdatera");
        }

        // Ändrar betyget om det skickades med
        if (request.rating() != null) {
            review.setRating(request.rating());
        }

        // Ändrar texten om den skickades med. En tom text tar bort texten
        if (request.text() != null) {
            review.setText(cleanText(request.text()));
        }

        // saveAndFlush skickar ändringen till databasen direkt,
        // så att updatedAt hinner få sin nya tid innan vi skickar svaret
        Review saved = reviewRepository.saveAndFlush(review);

        return ReviewResponse.from(saved);
    }

    // Tar bort en recension
    @Transactional
    public void deleteReview(Long reviewId, String username) {
        Review review = findOwnReview(reviewId, username);
        reviewRepository.delete(review);
    }

    // Hjälpmetod: hämtar användaren utifrån användarnamnet i token.
    // Om användaren inte finns längre (till exempel borttagen): 401
    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Användaren hittades inte"));
    }

    // Hjälpmetod: hämtar en recension och kontrollerar att den tillhör användaren.
    // Används av både update och delete, så att kontrollen bara finns på ett ställe
    private Review findOwnReview(Long reviewId, String username) {

        // Recensionen måste finnas
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recensionen hittades inte"));

        // Bara den som skrev recensionen får ändra eller ta bort den: annars 403
        if (!review.getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Du kan bara ändra dina egna recensioner");
        }

        return review;
    }

    // Hjälpmetod: tar bort mellanslag i början och slutet.
    // En tom text sparas som null, alltså "ingen text"
    private String cleanText(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }
        return text.trim();
    }
}