package com.alexreichstein.filmapp.model;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

// @Entity betyder att klassen blir en tabell i databasen
@Entity
// Tabellen heter "reviews".
// Unik-regeln gör att samma användare bara kan ha en recension per film
@Table(
    name = "reviews",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "movie_id"})
)
public class Review {

    // Primärnyckel, skapas automatiskt av databasen
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Betyget 1–10. Obligatoriskt.
    // Själva kontrollen av 1–10 görs i DTO:n när anropet kommer in
    @Column(nullable = false)
    private Integer rating;

    // Recensionstexten. Valfri, max 1000 tecken
    @Column(length = 1000)
    private String text;

    // När recensionen skapades. Hibernate sätter tiden automatiskt
    // och updatable = false gör att den aldrig ändras efteråt
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    // När recensionen senast ändrades. Uppdateras automatiskt vid varje ändring
    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    // Filmen som recensionen gäller.
    // Många recensioner kan höra till samma film.
    // LAZY: filmen hämtas från databasen först när den behövs
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    // Kolumnen i reviews-tabellen som pekar på filmens id
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    // Användaren som skrev recensionen.
    // Många recensioner kan höra till samma användare
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    // Kolumnen i reviews-tabellen som pekar på användarens id
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Tom konstruktor, krävs av JPA
    public Review() {
    }

    // Konstruktor för att skapa en ny recension
    public Review(Integer rating, String text, Movie movie, User user) {
        this.rating = rating;
        this.text = text;
        this.movie = movie;
        this.user = user;
    }

    // Getters och setters.
    // createdAt och updatedAt har bara getters eftersom Hibernate sköter dem

    public Long getId() {
        return id;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}