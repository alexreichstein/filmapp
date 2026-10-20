import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { apiRequest } from '../api/client.js';
import MovieCard from '../components/MovieCard.js';
import PrimaryButton from '../components/PrimaryButton.js';

// Lista med alla filmer (US7, US8)
export default function MovieListScreen() {
  // Filmerna från API:t
  const [movies, setMovies] = useState([]);

  // True första gången filmerna hämtas
  const [loading, setLoading] = useState(true);

  // True när användaren drar listan nedåt för att uppdatera
  const [refreshing, setRefreshing] = useState(false);

  // Felmeddelande om hämtningen misslyckas
  const [errorMessage, setErrorMessage] = useState(null);

  // Hämtar filmerna från backend
  async function getMovies() {
    try {
      setErrorMessage(null);
      const result = await apiRequest('/api/movies');
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

  // Körs en gång när skärmen visas
  useEffect(() => {
    getMovies();
  }, []);

  // Medan data hämtas första gången (US17)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Hämtar filmer...</Text>
      </View>
    );
  }

  // Om något gick fel (US18), med möjlighet att försöka igen
  if (errorMessage) {
    return (
      <View style={styles.center}>
        <Text style={styles.message} accessibilityRole="alert">
          {errorMessage}
        </Text>
        <PrimaryButton title="Försök igen" onPress={handleRetry} />
      </View>
    );
  }

  // FlatList visar bara de kort som syns på skärmen,
  // vilket gör den effektiv även med många filmer.
  // ListEmptyComponent visas om listan är tom (US19), och är inte ett fel
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={movies}
      // Unik nyckel för varis film, måste vara en text
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} />}
      ListEmptyComponent={
        <Text style={styles.message}>Inga filmer hittades.</Text>
      }
      // Pull-to-refresh: dra listan nedåt för att hämta filmerna igen
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}

// Utseende för filmlistan
const styles = StyleSheet.create({
  center: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  list: {
    backgroundColor: '#f3f4f6',
  },
  listContent: {
    padding: 16,
  },
});