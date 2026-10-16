package com.alexreichstein.filmapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alexreichstein.filmapp.model.User;

// Repository för användare
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Hämtar en användare utifrån användarnamnet, används vid inloggning.
    // Spring förstår själv vad metoden ska göra utifrån namnet "findByUsername"
    Optional<User> findByUsername(String username);

    // Kontrollerar om ett användarnamn redan finns, används vid registrering
    boolean existsByUsername(String username);
}