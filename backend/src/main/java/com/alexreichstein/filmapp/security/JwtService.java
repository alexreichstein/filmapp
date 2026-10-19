package com.alexreichstein.filmapp.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// Skapar och kontrollerar JWT-tokens
@Service
public class JwtService {

    // Den hemliga nyckeln som signerar alla tokens
    private final SecretKey key;

    // Hur länge en token gäller, i millisekunder
    private final long expirationMs;

    // @Value hämtar värdena från application.properties
    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-ms}") long expirationMs) {
        // Gör om texten till en nyckel som kan användas för signering
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    // Skapar en ny token för en användare, används vid inloggning
    public String generateToken(String username) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                // subject = vem token tillhör, här användarnamnet
                .subject(username)
                // När token skapades
                .issuedAt(now)
                // När token slutar gälla
                .expiration(expiration)
                // Signerar token med den hemliga nyckeln
                .signWith(key)
                // Bygger ihop allt till den färdiga textsträngen
                .compact();
    }

    // Läser ut användarnamnet ur en token.
    // Kontrollerar samtidigt signaturen och att token inte har gått ut.
    // Om något är fel kastas ett JwtException
    public String extractUsername(String token) {
        return Jwts.parser()
                // Kontrollera signaturen med samma nyckel
                .verifyWith(key)
                .build()
                // Läs och kontrollera token
                .parseSignedClaims(token)
                // Hämta innehållet (payload)
                .getPayload()
                // Hämta subject, alltså användarnamnet
                .getSubject();
    }

    // Kontrollerar om en token är giltig: rätt signatur och inte utgången
    public boolean isTokenValid(String token) {
        try {
            extractUsername(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Fel signatur, utgången, trasig eller tom token
            return false;
        }
    }
}