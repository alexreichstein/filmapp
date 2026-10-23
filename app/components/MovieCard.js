import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import colors from '../constants/colors.js';

// Visar en film i en lista: affisch, titel, år, genre och regissör.
// movie:   filmen från API:t
// onPress: vad som händer när kortet trycks på (till exempel öppna detaljvyn)
export default function MovieCard({ movie, onPress }) {
  // Om filmen har en affisch visas bilden,
  // annars en grå ruta med filmens första bokstav
  const poster = movie.posterUrl ? (
    <Image
      source={{ uri: movie.posterUrl }}
      style={styles.poster}
      // Bilden beskriver inget utöver texten bredvid, så skärmläsare hoppar över den
      accessibilityIgnoresInvertColors
      accessible={false}
    />
  ) : (
    <View style={[styles.poster, styles.placeholder]}>
      <Text style={styles.placeholderText}>{movie.title.charAt(0)}</Text>
    </View>
  );

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      // Hela kortet läses upp som en knapp med filmens viktigaste information
      accessibilityRole="button"
      accessibilityLabel={`${movie.title}, ${movie.releaseYear}, ${movie.genre}`}
      accessibilityHint="Visar mer information om filmen"
    >
      {poster}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.meta}>
          {movie.releaseYear} · {movie.genre}
        </Text>
        <Text style={styles.director} numberOfLines={1}>
          {movie.director}
        </Text>
      </View>
    </Pressable>
  );
}

// Utseende för kortet
const styles = StyleSheet.create({
  card: {
    // Affisch till vänster och text till höger
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  poster: {
    // Fast storlek i affischens proportioner (2:3)
    width: 70,
    height: 105,
    borderRadius: 4,
  },
  placeholder: {
    backgroundColor: colors.posterPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.posterPlaceholderText,
  },
  info: {
    // Texten tar resten av bredden, så att långa titlar radbryts
    // istället för att hamna utanför skärmen (US20)
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  director: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});