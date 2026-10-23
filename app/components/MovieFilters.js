import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import colors from '../constants/colors.js';
import Chip from './Chip.js';

// Sorteringsalternativen. value skickas till backend, label visas i appen
const SORT_OPTIONS = [
  { value: 'title', label: 'A–Ö', accessibilityLabel: 'Sortera på titel, A till Ö' },
  { value: 'newest', label: 'Nyaste', accessibilityLabel: 'Sortera nyaste först' },
  { value: 'oldest', label: 'Äldsta', accessibilityLabel: 'Sortera äldsta först' },
];

// Sökfält, genreknappar och sortering ovanför filmlistan (US13, VG1).
// Komponenten visar bara valen. State och hämtning sköts av MovieListScreen.
// searchText:     det som står i sökfältet
// onSearchChange: anropas med den nya texten när användaren skriver
// genres:         alla genrer från API:t
// selectedGenre:  vald genre, null betyder alla
// onGenreChange:  anropas med den nya genren, eller null för alla
// sort:           vald sortering ('title', 'newest' eller 'oldest')
// onSortChange:   anropas med den nya sorteringen
export default function MovieFilters({
  searchText,
  onSearchChange,
  genres,
  selectedGenre,
  onGenreChange,
  sort,
  onSortChange,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        value={searchText}
        onChangeText={onSearchChange}
        placeholder="Sök på titel"
        placeholderTextColor={colors.textMuted}
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

      <View style={[styles.chipRow, styles.sortRow]}>
        <Text style={styles.sortLabel}>Sortera:</Text>
        {SORT_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            accessibilityLabel={option.accessibilityLabel}
            selected={sort === option.value}
            onPress={() => onSortChange(option.value)}
          />
        ))}
      </View>
    </View>
  );
}

// Utseende för filtren
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  search: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
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
  sortRow: {
    // Sorteringsknapparna radbryts på smala skärmar istället för att hamna utanför (US20)
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sortLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});