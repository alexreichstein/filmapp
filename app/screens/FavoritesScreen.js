import { useContext } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import MovieCard from '../components/MovieCard.js';
import PrimaryButton from '../components/PrimaryButton.js';
import colors from '../constants/colors.js';
import { FavoritesContext } from '../context/FavoritesContext.js';

// Lista med användarens favoritfilmer.
// Favoriterna finns redan sparade på telefonen (AsyncStorage),
// så inget API-anrop och ingen laddning behövs
export default function FavoritesScreen({ navigation }) {
  const { favorites } = useContext(FavoritesContext);

  // Sorterar favoriterna A–Ö. localeCompare med 'sv' sorterar å, ä och ö rätt.
  // [...favorites] gör en kopia, så att listan i Contexten inte ändras
  const sortedFavorites = [...favorites].sort((a, b) =>
    a.title.localeCompare(b.title, 'sv')
  );

  // Öppnar detaljvyn för en film, på samma sätt som från filmlistan
  function openMovie(movie) {
    navigation.navigate('MovieDetails', { movieId: movie.id, title: movie.title });
  }

  // Samma MovieCard som i filmlistan.
  // ListEmptyComponent visas om det inte finns några favoriter (US19)
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={sortedFavorites}
      // Unik nyckel för varje film, måste vara en text
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <MovieCard movie={item} onPress={() => openMovie(item)} />
      )}
      ListEmptyComponent={
        <View>
          <Text style={styles.message}>Du har inga favoriter ännu.</Text>
          <Text style={styles.hint}>
            Tryck på hjärtat på en film för att spara den här.
          </Text>
          <PrimaryButton
            title="Visa filmer"
            onPress={() => navigation.navigate('MovieList')}
          />
        </View>
      }
    />
  );
}

// Utseende för favoritlistan
const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  hint: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
});