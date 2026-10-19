package com.alexreichstein.filmapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.alexreichstein.filmapp.model.Movie;
import com.alexreichstein.filmapp.repository.MovieRepository;

// @Service talar om för Spring att klassen innehåller logik
// och ska kunna skickas in i andra klasser, till exempel controllern
@Service
public class MovieService {

    // Repositoryt som hämtar filmer från databasen
    private final MovieRepository movieRepository;

    // Spring skickar in MovieRepository automatiskt via konstruktorn
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // Hämtar filmer med valfri sökning, filtrering och sortering.
    // Alla tre parametrar kan vara null om appen inte skickar dem
    public List<Movie> getMovies(String search, String genre, String sort) {
        return movieRepository.searchMovies(
                clean(search),
                clean(genre),
                toSort(sort));
    }

    // Hämtar en film med ett visst id.
    // Optional betyder att filmen kanske inte finns,
    // och tvingar oss att hantera det fallet
    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    // Hämtar alla genrer som finns bland filmerna
    public List<String> getGenres() {
        return movieRepository.findAllGenres();
    }

    // Hjälpmetod: gör om null till tom text och tar bort mellanslag i början och slutet.
    // Tom text betyder "inget villkor" i sökfrågan
    private String clean(String value) {
        if (value == null) {
            return "";
        }
        return value.trim();
    }

    // Hjälpmetod: gör om sort-parametern till en sortering för databasen.
    // Okänt eller saknat värde ger standardsorteringen: titel A–Ö
    private Sort toSort(String sort) {
        if (sort == null) {
            return Sort.by("title").ascending();
        }

        return switch (sort) {
            // Nyaste först, och titel som andra sortering vid samma år
            case "newest" -> Sort.by("releaseYear").descending().and(Sort.by("title"));
            // Äldsta först
            case "oldest" -> Sort.by("releaseYear").ascending().and(Sort.by("title"));
            // "title" och allt annat: titel A–Ö
            default -> Sort.by("title").ascending();
        };
    }
}