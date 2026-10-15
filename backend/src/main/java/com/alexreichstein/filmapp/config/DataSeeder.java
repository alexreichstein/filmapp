package com.alexreichstein.filmapp.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.alexreichstein.filmapp.model.Movie;
import com.alexreichstein.filmapp.repository.MovieRepository;

// @Component gör att Spring skapar och kör klassen automatiskt
@Component
// CommandLineRunner betyder att run-metoden körs en gång när backend har startat
public class DataSeeder implements CommandLineRunner {

    // Repositoryt som vi använder för att spara filmerna
    private final MovieRepository movieRepository;

    // Spring skickar in MovieRepository automatiskt via konstruktorn
    public DataSeeder(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public void run(String... args) {

        // Om det redan finns filmer gör vi ingenting, så att vi inte får dubbletter
        if (movieRepository.count() > 0) {
            return;
        }

        // Lista med startfilmer. Affisch (posterUrl) är null tills vidare
        List<Movie> movies = List.of(

            // Sci-Fi
            new Movie("Inception", 2010, "Sci-Fi", "Christopher Nolan",
                "En tjuv som stjäl hemligheter ur människors drömmar får i uppdrag att istället plantera en idé.", null),
            new Movie("Interstellar", 2014, "Sci-Fi", "Christopher Nolan",
                "En grupp astronauter reser genom ett maskhål för att hitta en ny planet åt mänskligheten.", null),
            new Movie("The Matrix", 1999, "Sci-Fi", "Lana och Lilly Wachowski",
                "En hackare upptäcker att världen han lever i är en datorsimulering.", null),
            new Movie("Blade Runner 2049", 2017, "Sci-Fi", "Denis Villeneuve",
                "En ung blade runner hittar en hemlighet som kan förändra samhället för alltid.", null),

            // Action
            new Movie("The Dark Knight", 2008, "Action", "Christopher Nolan",
                "Batman ställs mot Jokern, som vill kasta Gotham City ut i kaos.", null),
            new Movie("Mad Max: Fury Road", 2015, "Action", "George Miller",
                "I en ödslig framtid flyr en grupp kvinnor från en tyrann med hjälp av en ensam vandrare.", null),
            new Movie("Gladiator", 2000, "Action", "Ridley Scott",
                "En romersk general blir förrådd och tvingas kämpa som gladiator för att få hämnd.", null),

            // Drama
            new Movie("The Shawshank Redemption", 1994, "Drama", "Frank Darabont",
                "En oskyldigt dömd man bygger upp en vänskap och ett hopp under många år i fängelse.", null),
            new Movie("Forrest Gump", 1994, "Drama", "Robert Zemeckis",
                "En godhjärtad man råkar vara med om flera av de stora händelserna i USA:s historia.", null),

            // Thriller
            new Movie("Parasite", 2019, "Thriller", "Bong Joon-ho",
                "En fattig familj tar sig in i en rik familjs liv, med oväntade följder.", null),
            new Movie("Se7en", 1995, "Thriller", "David Fincher",
                "Två poliser jagar en seriemördare som bygger sina brott på de sju dödssynderna.", null),

            // Komedi
            new Movie("The Grand Budapest Hotel", 2014, "Komedi", "Wes Anderson",
                "En legendarisk hotellconcierge och hans piccolo dras in i en jakt på en stulen tavla.", null),
            new Movie("Superbad", 2007, "Komedi", "Greg Mottola",
                "Två bästa vänner försöker göra sista veckan innan studenten till något minnesvärt.", null),

            // Animerat
            new Movie("Spirited Away", 2001, "Animerat", "Hayao Miyazaki",
                "En flicka hamnar i en magisk värld och måste arbeta på ett badhus för andar för att rädda sina föräldrar.", null),
            new Movie("Toy Story", 1995, "Animerat", "John Lasseter",
                "En cowboydocka känner sig hotad när en ny rymdleksak flyttar in i pojkrummet.", null),

            // Skräck
            new Movie("Get Out", 2017, "Skräck", "Jordan Peele",
                "Ett besök hos flickvännens familj blir allt obehagligare för en ung man.", null),
            new Movie("The Shining", 1980, "Skräck", "Stanley Kubrick",
                "En författare blir vaktmästare på ett isolerat hotell under vintern och börjar förändras.", null),
            new Movie("Alien", 1979, "Skräck", "Ridley Scott",
                "Besättningen på ett rymdskepp jagas av en dödlig utomjordisk varelse.", null)
        );

        // Sparar alla filmer i databasen på en gång
        movieRepository.saveAll(movies);
    }
}