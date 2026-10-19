package com.alexreichstein.filmapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.alexreichstein.filmapp.security.JwtAuthenticationFilter;
import com.alexreichstein.filmapp.security.JwtService;

// @Configuration betyder att klassen innehåller inställningar för Spring
@Configuration
public class SecurityConfig {

    // Behövs för att skapa vårt JWT-filter
    private final JwtService jwtService;

    // Spring skickar in JwtService automatiskt via konstruktorn
    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // @Bean gör att Spring använder våra säkerhetsregler istället för standardreglerna
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF-skydd behövs för webbsidor med cookies och formulär.
            // Vårt REST API använder token istället, så vi stänger av det
            .csrf(csrf -> csrf.disable())

            // Servern sparar inga inloggningssessioner.
            // Varje anrop måste själv visa vem användaren är med sin token
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Reglerna för vilka adresser som är öppna och vilka som är skyddade
            .authorizeHttpRequests(auth -> auth
                // Registrering och inloggning måste vara öppna, annars kan ingen logga in
                .requestMatchers("/api/auth/**").permitAll()
                // Alla får hämta filmer, även utloggade
                .requestMatchers(HttpMethod.GET, "/api/movies/**").permitAll()
                // Springs interna felsida. Utan denna rad blir alla fel (till exempel 400 och 409)
                // istället 403 Forbidden, eftersom felsidan också skulle vara låst
                .requestMatchers("/error").permitAll()
                // Allt annat kräver inloggning
                .anyRequest().authenticated()
            )

            // Om en utloggad användare anropar en skyddad adress svarar vi 401 Unauthorized.
            // Utan detta svarar Spring 403 Forbidden, vilket betyder "du får inte",
            // medan 401 betyder "du är inte inloggad". Appen kan då skicka användaren till login
            .exceptionHandling(exception ->
                exception.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))

            // Lägger in vårt JWT-filter före Springs vanliga inloggningsfilter,
            // så att token kontrolleras tidigt i varje anrop
            .addFilterBefore(new JwtAuthenticationFilter(jwtService),
                    UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Krypterar lösenord med BCrypt.
    // Som en @Bean kan den användas i andra klasser, till exempel vid registrering
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}