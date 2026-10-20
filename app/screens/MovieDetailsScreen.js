import { useCallback, useContext, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { apiRequest } from '../api/client.js';
import PrimaryButton from '../components/PrimaryButton.js';
import ReviewCard from '../components/ReviewCard.js';
import { AuthContext } from '../context/AuthContext.js';
import useDeleteReview from '../hooks/useDeleteReview.js';

// Räknar ut snittbetyget från recensionerna, med en decimal.
// Returnerar null om det inte finns några recensioner
function getAverageRating(reviews) {
  if (reviews.length === 0) {
    return null;
  }

  // reduce lägger ihop alla betyg, som getTotalPrice i lärarens exempel
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

// Detaljvy för en film med dess recensioner (US9, grund för VG5).
// route.params innehåller movieId som skickades från filmlistan
export default function MovieDetailsScreen({ route, navigation }) {
  const { movieId } = route.params;

  // Inloggningen, för att visa rätt knapp och hitta användarens egen recension
  const { isLoggedIn, username } = useContext(AuthContext);

  // Vår egen hook för att ta bort recensioner
  const { confirmDelete, deletingId } = useDeleteReview();

  // Filmen och dess recensioner från API:t
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  // True medan data hämtas första gången
  const [loading, setLoading] = useState(true);

  // Fel för filmen (hela skärmen) och för recensionerna (bara den delen)
  const [errorMessage, setErrorMessage] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);

  // Hämtar filmen och recensionerna samtidigt.
  // allSettled väntar på båda och ger resultatet för varje anrop för sig,
  // så att filmen kan visas även om recensionerna inte gick att hämta
  async function loadDetails() {
    setErrorMessage(null);
    setReviewsError(null);

    const [movieResult, reviewsResult] = await Promise.allSettled([
      apiRequest(`/api/movies/${movieId}`),
      apiRequest(`/api/movies/${movieId}/reviews`),
    ]);

    // Filmen är nödvändig: misslyckas den visas ett fel för hela skärmen
    if (movieResult.status === 'fulfilled') {
      setMovie(movieResult.value);
    } else {
      setErrorMessage(movieResult.reason?.message ?? 'Kunde inte hämta filmen.');
    }

    // Recensionerna är inte nödvändiga: misslyckas de visas ett fel bara där
    if (reviewsResult.status === 'fulfilled') {
      setReviews(reviewsResult.value);
    } else {
      setReviewsError(reviewsResult.reason?.message ?? 'Kunde inte hämta recensionerna.');
    }

    setLoading(false);
  }

  // Körs när användaren trycker på "Försök igen"
  function handleRetry() {
    setLoading(true);
    loadDetails();
  }

  // Tar bort recensionen ur listan när borttagningen har lyckats.
  // Snittbetyget och knappen uppdateras automatiskt eftersom de räknas ut från listan
  function handleDeleted(reviewId) {
    setReviews((current) => current.filter((review) => review.id !== reviewId));
  }

  // Körs varje gång skärmen visas, även när användaren kommer tillbaka
  // från recensionsformuläret. Då syns en ny eller ändrad recension direkt.
  // useCallback gör att funktionen inte skapas om vid varje omritning
  useFocusEffect(
    useCallback(() => {
      loadDetails();
    }, [movieId])
  );

  // Medan data hämtas första gången (US17)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Hämtar filmen...</Text>
      </View>
    );
  }

  // Om filmen inte gick att hämta (US18)
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

  const averageRating = getAverageRating(reviews);

  // Användarens egen recension av filmen, om den finns
  const myReview = isLoggedIn
    ? reviews.find((review) => review.username === username)
    : undefined;

  // Knappen för recensioner beror på inloggning och om användaren redan har recenserat
  let reviewButton;

  if (!isLoggedIn) {
    reviewButton = (
      <PrimaryButton
        title="Logga in för att skriva en recension"
        variant="secondary"
        onPress={() => navigation.navigate('Login')}
      />
    );
  } else if (myReview) {
    reviewButton = (
      <PrimaryButton
        title="Ändra din recension"
        variant="secondary"
        onPress={() =>
          navigation.navigate('ReviewForm', {
            movieId,
            movieTitle: movie.title,
            review: myReview,
          })
        }
      />
    );
  } else {
    reviewButton = (
      <PrimaryButton
        title="Skriv recension"
        onPress={() =>
          navigation.navigate('ReviewForm', { movieId, movieTitle: movie.title })
        }
      />
    );
  }

  // Ritar en recension. Användarens egen recension får en knapp för att ta bort den
  function renderReview({ item }) {
    const isMine = item.id === myReview?.id;

    return (
      <ReviewCard review={item}>
        {isMine && (
          <View style={styles.cardActions}>
            <PrimaryButton
              title="Ta bort"
              variant="danger"
              accessibilityLabel="Ta bort din recension"
              // Snurra på knappen medan just den här recensionen tas bort
              loading={deletingId === item.id}
              onPress={() => confirmDelete(item, handleDeleted)}
            />
          </View>
        )}
      </ReviewCard>
    );
  }

  // Affisch eller platshållare med första bokstaven, som i MovieCard
  const poster = movie.posterUrl ? (
    <Image source={{ uri: movie.posterUrl }} style={styles.poster} accessible={false} />
  ) : (
    <View style={[styles.poster, styles.placeholder]}>
      <Text style={styles.placeholderText}>{movie.title.charAt(0)}</Text>
    </View>
  );

  // Filminformationen visas överst i listan, ovanför recensionerna
  const header = (
    <View>
      <View style={styles.posterArea}>{poster}</View>

      <Text style={styles.title} accessibilityRole="header">
        {movie.title}
      </Text>
      <Text style={styles.meta}>
        {movie.releaseYear} · {movie.genre}
      </Text>
      <Text style={styles.meta}>Regi: {movie.director}</Text>
      <Text style={styles.description}>{movie.description}</Text>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Recensioner
      </Text>

      {averageRating && (
        <Text
          style={styles.average}
          accessibilityLabel={`Snittbetyg ${averageRating} av 10 från ${reviews.length} recensioner`}
        >
          Snittbetyg {averageRating}/10 ({reviews.length} st)
        </Text>
      )}

      <View style={styles.reviewButtonArea}>{reviewButton}</View>

      {reviewsError && (
        <Text style={styles.reviewsError} accessibilityRole="alert">
          {reviewsError}
        </Text>
      )}
    </View>
  );

  // FlatList med filmen som rubrik och recensionerna som rader.
  // ListEmptyComponent visas om filmen saknar recensioner (US19),
  // men inte om recensionerna inte gick att hämta, då visas felet ovan
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={reviews}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderReview}
      ListHeaderComponent={header}
      ListEmptyComponent={
        reviewsError ? null : (
          <Text style={styles.message}>Inga recensioner ännu.</Text>
        )
      }
    />
  );
}

// Utseende för detaljvyn
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
  posterArea: {
    alignItems: 'center',
    marginBottom: 16,
  },
  poster: {
    // Affischens proportioner (2:3)
    width: 140,
    height: 210,
    borderRadius: 6,
  },
  placeholder: {
    backgroundColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#475569',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  meta: {
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  average: {
    fontSize: 16,
    marginBottom: 12,
  },
  reviewButtonArea: {
    marginBottom: 16,
  },
  reviewsError: {
    color: '#b91c1c',
    fontSize: 16,
    marginBottom: 12,
  },
  cardActions: {
    marginTop: 10,
  },
});