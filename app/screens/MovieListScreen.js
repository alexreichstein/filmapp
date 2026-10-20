import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { apiRequest } from '../api/client.js';

// Filmlistan. Just nu visas bara antalet filmer,
// för att testa att kopplingen till API:t fungerar
export default function MovieListScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Hämtar filmerna från backend
  async function getMovies() {
    try {
      const result = await apiRequest('/api/movies');
      setMovies(result);
    } catch (error) {
      // error.message är redan ett begripligt meddelande från apiRequest
      setErrorMessage(error.message);
    } finally {
      // Körs både när det lyckas och misslyckas
      setLoading(false);
    }
  }

  // Körs en gång när skärmen visas
  useEffect(() => {
    getMovies();
  }, []);

  // Medan data hämtas (US17)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Hämtar filmer...</Text>
      </View>
    );
  }

  // Om något gick fel (US18)
  if (errorMessage) {
    return (
      <View style={styles.center}>
        <Text>{errorMessage}</Text>
      </View>
    );
  }

  // Om det inte finns några filmer (US19), inte ett fel
  if (movies.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Inga filmer hittades.</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text>Hittade {movies.length} filmer från API:t.</Text>
    </View>
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
});