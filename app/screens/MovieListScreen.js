import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { apiRequest } from '../api/client.js';
import MovieCard from '../components/MovieCard.js';
import MovieFilters from '../components/MovieFilters.js';
import PrimaryButton from '../components/PrimaryButton.js';

// Hur länge appen väntar efter senaste tangenttrycket innan den söker
const SEARCH_DELAY_MS = 400;

// Bygger adressen till filmerna, med sökord om det finns, till exempel
// /api/movies?search=dark
// encodeURIComponent kodar om mellanslag och å, ä, ö så att de fungerar i en adress
function buildMoviesPath(search) {
  if (search) {
    return `/api/movies?search=${encodeURIComponent(search)}`;
  }
  return '/api/movies';
}

// Lista med filmer och sökning (US7, US8, US13)
export default function MovieListScreen({ navigation }) {
  // Filmerna från API:t
  const [movies, setMovies] = useState([]);

  // Det som står i sökfältet, uppdateras vid varje bokstav
  const [searchText, setSearchText] = useState('');

  // Sökordet som skickas till backend, uppdateras först efter en kort paus (debounce)
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // True medan filmerna hämtas
  const [loading, setLoading] = useState(true);

  // True när användaren drar listan nedåt för att uppdatera
  const [refreshing, setRefreshing] = useState(false);

  // Felmeddelande om hämtningen misslyckas
  const [errorMessage, setErrorMessage] = useState(null);

  // Hämtar filmerna med aktuellt sökord
  async function getMovies() {
    try {
      setErrorMessage(null);
      const result = await apiRequest(buildMoviesPath(debouncedSearch.trim()));
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

  // Tömmer sökfältet. Båda värdena nollställs direkt, utan att vänta på debounce
  function handleClearSearch() {
    setSearchText('');
    setDebouncedSearch('');
  }

  // Öppnar detaljvyn för en film.
  // Bara id och titel skickas med, detaljvyn hämtar resten själv
  function openMovie(movie) {
    navigation.navigate('MovieDetails', { movieId: movie.id, title: movie.title });
  }

  // Debounce: startar en timer varje gång texten ändras.
  // Funktionen som returneras avbryter den gamla timern innan en ny startar,
  // så sökordet uppdateras först när användaren har slutat skriva en stund
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, SEARCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Hämtar filmerna när skärmen visas och varje gång sökordet ändras
  useEffect(() => {
    setLoading(true);
    getMovies();
  }, [debouncedSearch]);

  // Om något står i sökfältet, för att visa rätt meddelande vid tom lista
  const isSearching = searchText.trim() !== '';

  // Innehållet under sökfältet beror på läget.
  // Sökfältet står kvar hela tiden, så att tangentbordet inte stängs
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
              {isSearching ? 'Inga filmer matchar din sökning.' : 'Inga filmer hittades.'}
            </Text>
            {isSearching && (
              <PrimaryButton
                title="Rensa sökningen"
                variant="secondary"
                onPress={handleClearSearch}
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
      <MovieFilters searchText={searchText} onSearchChange={setSearchText} />
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