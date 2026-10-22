import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import Chip from './Chip.js';

// Sökfält och genreknappar ovanför filmlistan (US13).
// Komponenten visar bara valen. State och hämtning sköts av MovieListScreen.
// searchText:     det som står i sökfältet
// onSearchChange: anropas med den nya texten när användaren skriver
// genres:         alla genrer från API:t
// selectedGenre:  vald genre, null betyder alla
// onGenreChange:  anropas med den nya genren, eller null för alla
export default function MovieFilters({
  searchText,
  onSearchChange,
  genres,
  selectedGenre,
  onGenreChange,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        value={searchText}
        onChangeText={onSearchChange}
        placeholder="Sök på titel"
        placeholderTextColor="#6b7280"
        // Ingen autokorrigering, så att titlar inte ändras medan man skriver
        autoCorrect={false}
        // Tangentbordets Enter-knapp visas som "Sök"
        returnKeyType="search"
        accessibilityLabel="Sök film på titel"
      />

      {genres.length > 0 && (
        <ScrollView
          horizontal
          // Genrerna scrollar i sidled så att de får plats på alla skärmstorlekar (US20)
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          // Ett tryck på en genre fungerar direkt, även när tangentbordet är öppet
          keyboardShouldPersistTaps="handled"
        >
          <Chip
            label="Alla"
            accessibilityLabel="Alla genrer"
            selected={selectedGenre === null}
            onPress={() => onGenreChange(null)}
          />
          {genres.map((genre) => (
            <Chip
              key={genre}
              label={genre}
              accessibilityLabel={`Genre ${genre}`}
              selected={selectedGenre === genre}
              onPress={() => onGenreChange(genre)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// Utseende för filtren
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // Avstånd mellan knapparna
    gap: 8,
    paddingBottom: 4,
  },
});