package com.alexreichstein.filmapp.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.alexreichstein.filmapp.model.Movie;

// Repository för filmer
@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    // Söker och filtrerar filmer. Båda villkoren är valfria:
    // - search: titeln innehåller texten, oavsett stora/små bokstäver.
    //   Tom text ('') ger LIKE '%%', som matchar alla filmer
    // - genre: exakt genre, oavsett stora/små bokstäver.
    //   Tom text ('') gör att villkoret blir sant för alla filmer
    // Sort bestämmer ordningen och skickas in från MovieService
    @Query("""
            SELECT m FROM Movie m
            WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%'))
            AND (:genre = '' OR LOWER(m.genre) = LOWER(:genre))
            """)
    List<Movie> searchMovies(@Param("search") String search,
                             @Param("genre") String genre,
                             Sort sort);

    // Alla genrer som finns, utan dubbletter och i bokstavsordning.
    // Används av appen för att bygga filterknapparna
    @Query("SELECT DISTINCT m.genre FROM Movie m ORDER BY m.genre")
    List<String> findAllGenres();
}