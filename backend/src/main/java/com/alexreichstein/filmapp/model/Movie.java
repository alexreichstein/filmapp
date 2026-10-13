package com.alexreichstein.filmapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// @Entity betyder att klassen ska bli en tabell i databasen
@Entity
// Tabellen får namnet "movies"
@Table(name = "movies")
public class Movie {

    // Primärnyckel, ett unikt id för varje film
    @Id
    // Databasen skapar id automatiskt (1, 2, 3 ...)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Filmens titel, får inte vara tom
    @Column(nullable = false)
    private String title;

    // Utgivningsår. Heter inte "year" eftersom det är ett reserverat ord i SQL
    private Integer releaseYear;

    // Genre, används för filtrering i appen
    private String genre;

    // Regissör
    private String director;

    // Beskrivning av filmen. Längre text än standard (255 tecken)
    @Column(length = 2000)
    private String description;

    // Länk till filmens affisch
    private String posterUrl;

    // Tom konstruktor, krävs av JPA för att kunna skapa objekt från databasen
    public Movie() {
    }

    // Konstruktor för att enkelt skapa filmer, till exempel i startdatan
    public Movie(String title, Integer releaseYear, String genre, String director,
                 String description, String posterUrl) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.genre = genre;
        this.director = director;
        this.description = description;
        this.posterUrl = posterUrl;
    }

    // Getters och setters, så att Spring kan läsa och skriva fälten

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
}