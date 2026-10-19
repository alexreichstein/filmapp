package com.alexreichstein.filmapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alexreichstein.filmapp.model.Review;

// Repository för recensioner
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Alla recensioner för en film, nyaste först.
    // "MovieId" betyder: gå via fältet movie och jämför dess id
    List<Review> findByMovieIdOrderByCreatedAtDesc(Long movieId);

    // Alla recensioner som en användare har skrivit, nyaste först.
    // "UserUsername" betyder: gå via fältet user och jämför dess username
    List<Review> findByUserUsernameOrderByCreatedAtDesc(String username);

    // Kontrollerar om användaren redan har recenserat filmen
    boolean existsByUserIdAndMovieId(Long userId, Long movieId);
}