import { StyleSheet, Text, View } from 'react-native';

import colors from '../constants/colors.js';

// Gör om en tidpunkt från API:t (till exempel "2026-10-19T13:54:36Z")
// till ett svenskt datum, till exempel "2026-10-19"
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('sv-SE');
}

// Visar en recension.
// review:         recensionen från API:t
// showMovieTitle: visar filmens titel istället för användarnamnet,
//                 används i profilen där alla recensioner är användarens egna
// children:       extra innehåll längst ner, till exempel knappar för att ändra och ta bort
export default function ReviewCard({ review, showMovieTitle = false, children }) {
  // Om tiderna skiljer sig har recensionen ändrats efter att den skrevs
  const isEdited = review.updatedAt !== review.createdAt;

  // Rubriken är antingen filmens titel eller vem som skrev recensionen
  const heading = showMovieTitle ? review.movieTitle : review.username;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.heading} numberOfLines={1}>
          {heading}
        </Text>
        <Text
          style={styles.rating}
          // Skärmläsare läser "Betyg 8 av 10" istället för "8/10"
          accessibilityLabel={`Betyg ${review.rating} av 10`}
        >
          {review.rating}/10
        </Text>
      </View>

      {review.text && <Text style={styles.text}>{review.text}</Text>}

      <Text style={styles.date}>
        {formatDate(review.createdAt)}
        {isEdited && ' (redigerad)'}
      </Text>

      {children}
    </View>
  );
}

// Utseende för recensionen
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    // Namn till vänster och betyg till höger
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heading: {
    // Tar den plats som finns kvar, så att betyget alltid får plats
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  text: {
    fontSize: 15,
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: colors.textMuted,
  },
});