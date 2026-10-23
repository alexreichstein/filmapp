import { useContext } from 'react';
import { AccessibilityInfo, Alert, Pressable, StyleSheet, Text } from 'react-native';

import { FavoritesContext } from '../context/FavoritesContext.js';

// Knapp med ett hjärta för att spara eller ta bort en film som favorit.
// movie: filmen som knappen gäller
export default function FavoriteButton({ movie }) {
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);

  const favorite = isFavorite(movie.id);

  // Körs när användaren trycker på knappen
  async function handlePress() {
    try {
      const added = await toggleFavorite(movie);

      // Knappen ändras synligt, och skärmläsare får höra vad som hände (US14)
      AccessibilityInfo.announceForAccessibility(
        added ? 'Tillagd i favoriter' : 'Borttagen från favoriter'
      );
    } catch (error) {
      Alert.alert('Något gick fel', error.message);
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        favorite && styles.active,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      // Skärmläsare läser upp vad knappen gör och om filmen är favorit
      accessibilityRole="button"
      accessibilityState={{ selected: favorite }}
      accessibilityLabel={
        favorite ? `Ta bort ${movie.title} från favoriter` : `Spara ${movie.title} som favorit`
      }
    >
      <Text style={styles.heart}>{favorite ? '♥' : '♡'}</Text>
      <Text style={styles.text}>{favorite ? 'Sparad som favorit' : 'Spara som favorit'}</Text>
    </Pressable>
  );
}

// Utseende för knappen
const styles = StyleSheet.create({
  button: {
    // Hjärta och text bredvid varandra
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    // Minst 48 punkter hög så att den är lätt att trycka på
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#be123c',
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: '#ffe4e6',
  },
  pressed: {
    opacity: 0.7,
  },
  heart: {
    fontSize: 22,
    color: '#be123c',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#be123c',
  },
});