import { StyleSheet, TextInput, View } from 'react-native';

// Sökfältet ovanför filmlistan (US13).
// Komponenten visar bara fältet. State och hämtning sköts av MovieListScreen.
// searchText:     det som står i sökfältet
// onSearchChange: anropas med den nya texten när användaren skriver
export default function MovieFilters({ searchText, onSearchChange }) {
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
    </View>
  );
}

// Utseende för filtren
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});