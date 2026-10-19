package com.alexreichstein.filmapp.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Filter som körs en gång per anrop, innan anropet når controllern.
// Läser token från Authorization-headern och talar om för Spring Security vem användaren är
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Början på headern: "Authorization: Bearer eyJ..."
    private static final String BEARER_PREFIX = "Bearer ";

    // Används för att kontrollera token och läsa ut användarnamnet
    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Hämtar Authorization-headern från anropet
        String header = request.getHeader("Authorization");

        // Om headern saknas eller inte börjar med "Bearer " finns ingen token.
        // Då skickar vi bara vidare anropet utan inloggad användare.
        // Öppna adresser fungerar ändå, skyddade blir nekade senare av reglerna
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Plockar ut själva token, alltså allt efter "Bearer "
        String token = header.substring(BEARER_PREFIX.length());

        // Om token är giltig markeras användaren som inloggad för just detta anrop
        if (jwtService.isTokenValid(token)) {
            String username = jwtService.extractUsername(token);

            // Skapar ett inloggningsobjekt för Spring Security:
            // användarnamn, inget lösenord (behövs inte, token är redan kontrollerad)
            // och en tom lista med roller (vi har inga roller i appen)
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, List.of());

            // Sparar inloggningen så att resten av anropet vet vem användaren är
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Skickar vidare anropet till nästa steg
        filterChain.doFilter(request, response);
    }
}