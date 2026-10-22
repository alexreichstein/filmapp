import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { apiRequest } from '../api/client.js';
import MovieCard from '../components/MovieCard.js';
import MovieFilters from '../components/MovieFilters.js';
import PrimaryButton from '../components/PrimaryButton.js';

// Hur länge appen väntar efter senaste tangenttrycket innan den söker
const SEARCH_DELAY_MS = 400;

// Bygger adressen till filmerna med sökord och genre om de finns, till exempel
// /api/movies?search=the&genre=Action
// encodeURIComponent kodar om mellanslag och å, ä, ö så att de fungerar i en adress
function buildMoviesPath(search, genre) {
  const params = [];

  if (search) {
    params.push(`search=${encodeURIComponent(search)}`);
  }

  if (genre) {
    params.push(`genre=${encodeURIComponent(genre)}`);
  }

  // Utan parametrar: bara /api/movies
  if (params.length === 0) {
    return '/api/movies';
  }

  // Parametrarna sätts ihop med & mellan sig
  return `/api/movies?${params.join('&')}`;
}

// Lista med filmer, sökning och genrefilter (US7, US8, US13)
export default function MovieListScreen({ navigation }) {
  // Filmerna och genrerna från API:t
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  // Det som står i sökfältet, uppdateras vid varje bokstav
  const [searchText, setSearchText] = useState('');

  // Sökordet som skickas till backend, uppdateras först efter en kort paus (debounce)
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Vald genre, null betyder alla
  const [selectedGenre, setSelectedGenre] = useState(null);

  // True medan filmerna hämtas
  const [loading, setLoading] = useState(true);

  // True när användaren drar listan nedåt för att uppdatera
  const [refreshing, setRefreshing] = useState(false);

  // Felmeddelande om hämtningen misslyckas
  const [errorMessage, setErrorMessage] = useState(null);

  // Hämtar filmerna med aktuellt sökord och vald genre
  async function getMovies() {
    try {
      setErrorMessage(null);
      const path = buildMoviesPath(debouncedSearch.trim(), selectedGenre);
      const result = await apiRequest(path);
      setMovies(result);
    } catch (error) {
      // error.message är redan ett begripligt meddelande från apiRequest
      setErrorMessage(error.message);
    } finally {
      // Körs både när det lyckas och misslyckas
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Hämtar genrerna till filterknapparna.
  // Om det misslyckas döljs bara genreraden, sökningen fungerar ändå.
  // Felet loggas för utvecklaren men visas inte för användaren
  async function getGenres() {
    try {
      const result = await apiRequest('/api/movies/genres');
      setGenres(result);
    } catch (error) {
      console.log('Kunde inte hämta genrer:', error);
    }
  }

  // Körs när användaren drar listan nedåt
  function handleRefresh() {
    setRefreshing(true);
    getMovies();
  }

  // Körs när användaren trycker på "Försök igen" efter ett fel
  function handleRetry() {
    setLoading(true);
    getMovies();
  }

  // Tömmer sökfältet och väljer alla genrer.
  // Sökorden nollställs direkt, utan att vänta på debounce
  function handleClearFilters() {
    setSearchText('');
    setDebouncedSearch('');
    setSelectedGenre(null);
  }

  // Öppnar detaljvyn för en film.
  // Bara id och titel skickas med, detaljvyn hämtar resten själv
  function openMovie(movie) {
    navigation.navigate('MovieDetails', { movieId: movie.id, title: movie.title });
  }

  // Hämtar genrerna en gång när skärmen visas
  useEffect(() => {
    getGenres();
  }, []);

  // Debounce: startar en timer varje gång texten ändras.
  // Funktionen som returneras avbryter den gamla timern innan en ny startar,
  // så sökordet uppdateras först när användaren har slutat skriva en stund
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, SEARCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Hämtar filmerna när skärmen visas och varje gång sökord eller genre ändras.
  // Genren behöver ingen debounce, eftersom ett tryck är ett enda val
  useEffect(() => {
    setLoading(true);
    getMovies();
  }, [debouncedSearch, selectedGenre]);

  // Om sökord eller genre är valt, för att visa rätt meddelande vid tom lista
  const hasActiveFilters = searchText.trim() !== '' || selectedGenre !== null;

  // Innehållet under filtren beror på läget.
  // Filtren står kvar hela tiden, så att tangentbordet inte stängs
  let content;

  if (loading) {
    // Medan filmerna hämtas (US17)
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Hämtar filmer...</Text>
      </View>
    );
  } else if (errorMessage) {
    // Om något gick fel (US18), med möjlighet att försöka igen
    content = (
      <View style={styles.center}>
        <Text style={styles.message} accessibilityRole="alert">
          {errorMessage}
        </Text>
        <PrimaryButton title="Försök igen" onPress={handleRetry} />
      </View>
    );
  } else {
    // Listan. ListEmptyComponent visas om inga filmer matchar (US19), och är inte ett fel
    content = (
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={movies}
        // Unik nyckel för varje film, måste vara en text
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={() => openMovie(item)} />
        )}
        ListEmptyComponent={
          <View>
            <Text style={styles.message}>
              {hasActiveFilters ? 'Inga filmer matchar din sökning.' : 'Inga filmer hittades.'}
            </Text>
            {hasActiveFilters && (
              <PrimaryButton
                title="Rensa sökning och filter"
                variant="secondary"
                onPress={handleClearFilters}
              />
            )}
          </View>
        }
        // Pull-to-refresh: dra listan nedåt för att hämta filmerna igen
        refreshing={refreshing}
        onRefresh={handleRefresh}
        // Tangentbordet stängs när användaren börjar scrolla i listan
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <View style={styles.screen}>
      <MovieFilters
        searchText={searchText}
        onSearchChange={setSearchText}
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
      />
      {content}
    </View>
  );
}

// Utseende för filmlistan
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  center: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
});