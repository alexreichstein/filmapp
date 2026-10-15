package com.alexreichstein.filmapp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alexreichstein.filmapp.model.Movie;
import com.alexreichstein.filmapp.service.MovieService;

// @RestController betyder att klassen tar emot HTTP-anrop
// och att svaren automatiskt görs om till JSON
@RestController
// Alla endpoints i klassen börjar med /api/movies
@RequestMapping("/api/movies")
public class MovieController {

    // Servicen som innehåller logiken för filmer
    private final MovieService movieService;

    // Spring skickar in MovieService automatiskt via konstruktorn
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // GET /api/movies
    // Hämtar alla filmer och skickar tillbaka dem som en JSON-lista
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    // GET /api/movies/{id}, till exempel /api/movies/3
    // @PathVariable plockar ut id:t ur adressen
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id)
                // Om filmen finns: svara 200 OK med filmen
                .map(ResponseEntity::ok)
                // Om filmen inte finns: svara 404 Not Found
                .orElse(ResponseEntity.notFound().build());
    }
}