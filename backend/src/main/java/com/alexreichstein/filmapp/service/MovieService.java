package com.alexreichstein.filmapp.service;

import java.util.List;
import java.util.Optional;

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

    // Hämtar alla filmer
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // Hämtar en film med ett visst id.
    // Optional betyder att filmen kanske inte finns,
    // och tvingar oss att hantera det fallet
    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }
}