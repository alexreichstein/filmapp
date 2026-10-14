package com.alexreichstein.filmapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alexreichstein.filmapp.model.Movie;

// @Repository talar om för Spring att detta är klassen som pratar med databasen
@Repository
// Vi ärver från JpaRepository och anger två saker:
// Movie = vilken klass/tabell det gäller
// Long  = vilken typ id-fältet har
// Spring skapar själv all kod för findAll, findById, save, deleteById med flera
public interface MovieRepository extends JpaRepository<Movie, Long> {

    // Tomt just nu. Senare lägger vi till egna metoder här,
    // till exempel för sökning på titel och filtrering på genre
}