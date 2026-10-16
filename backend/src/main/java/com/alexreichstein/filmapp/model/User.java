package com.alexreichstein.filmapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// @Entity betyder att klassen blir en tabell i databasen
@Entity
// Tabellen heter "users" eftersom "user" är ett reserverat ord i PostgreSQL
@Table(name = "users")
public class User {

    // Primärnyckel, skapas automatiskt av databasen
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Användarnamnet. unique = true gör att två användare inte kan ha samma namn
    @Column(nullable = false, unique = true)
    private String username;

    // Lösenordet, sparas alltid krypterat med BCrypt, aldrig i klartext
    @Column(nullable = false)
    private String password;

    // Tom konstruktor, krävs av JPA
    public User() {
    }

    // Konstruktor för att skapa en ny användare vid registrering
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getters och setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}