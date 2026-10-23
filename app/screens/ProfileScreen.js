import { useCallback, useContext, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { apiRequest } from '../api/client.js';
import PrimaryButton from '../components/PrimaryButton.js';
import ReviewCard from '../components/ReviewCard.js';
import colors from '../constants/colors.js';
import { AuthContext } from '../context/AuthContext.js';
import useDeleteReview from '../hooks/useDeleteReview.js';

// Profilen för den inloggade användaren med hens egna recensioner (VG6).
// Skyddad skärm: finns bara i navigeringen när användaren är inloggad (US6)
export default function ProfileScreen({ navigation }) {
  const { username, token, logout } = useContext(AuthContext);

  // Samma hook för borttagning som i detaljvyn
  const { confirmDelete, deletingId } = useDeleteReview();

  // Användarens recensioner från API:t
  const [reviews, setReviews] = useState([]);

  // True medan recensionerna hämtas första gången
  const [loading, setLoading] = useState(true);

  // True när användaren drar listan nedåt för att uppdatera
  const [refreshing, setRefreshing] = useState(false);

  // Felmeddelande om hämtningen misslyckas
  const [errorMessage, setErrorMessage] = useState(null);

  // Hämtar den inloggade användarens recensioner.
  // Backend tar fram användaren ur token, så inget namn behöver skickas
  async function loadReviews() {
    try {
      setErrorMessage(null);
      const result = await apiRequest('/api/users/me/reviews', { token });
      setReviews(result);
    } catch (error) {
      // 401 betyder att inloggningen har gått ut.
      // Användaren loggas ut, och profilen försvinner eftersom den är skyddad
      if (error.status === 401) {
        await logout();
        Alert.alert('Utloggad', 'Din inloggning har gått ut. Logga in igen.');
        return;
      }

      setErrorMessage(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Körs när användaren drar listan nedåt
  function handleRefresh() {
    setRefreshing(true);
    loadReviews();
  }

  // Körs när användaren trycker på "Försök igen" efter ett fel
  function handleRetry() {
    setLoading(true);
    loadReviews();
  }

  // Tar bort recensionen ur listan när borttagningen har lyckats
  function handleDeleted(reviewId) {
    setReviews((current) => current.filter((review) => review.id !== reviewId));
  }

  // Loggar ut och bekräftar det för användaren (US5, US14).
  // Skärmen försvinner automatiskt eftersom den bara finns för inloggade
  async function handleLogout() {
    await logout();
    Alert.alert('Utloggad', 'Du är nu utloggad.');
  }

  // Körs varje gång skärmen visas, även när användaren kommer tillbaka
  // från recensionsformuläret eller detaljvyn. Då syns ändringar direkt
  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [token])
  );

  // Ritar en recension med filmens titel och tre knappar
  function renderReview({ item }) {
    return (
      <ReviewCard review={item} showMovieTitle>
        <View style={styles.cardActions}>
          <View style={styles.cardButton}>
            <PrimaryButton
              title="Visa film"
              variant="secondary"
              accessibilityLabel={`Visa ${item.movieTitle}`}
              onPress={() =>
                navigation.navigate('MovieDetails', {
                  movieId: item.movieId,
                  title: item.movieTitle,
                })
              }
            />
          </View>
          <View style={styles.cardButton}>
            <PrimaryButton
              title="Ändra"
              variant="secondary"
              accessibilityLabel={`Ändra din recension av ${item.movieTitle}`}
              onPress={() =>
                navigation.navigate('ReviewForm', {
                  movieId: item.movieId,
                  movieTitle: item.movieTitle,
                  review: item,
                })
              }
            />
          </View>
          <View style={styles.cardButton}>
            <PrimaryButton
              title="Ta bort"
              variant="danger"
              accessibilityLabel={`Ta bort din recension av ${item.movieTitle}`}
              // Snurra på knappen medan just den här recensionen tas bort
              loading={deletingId === item.id}
              onPress={() => confirmDelete(item, handleDeleted)}
            />
          </View>
        </View>
      </ReviewCard>
    );
  }

  // Rubriken med namn, antal recensioner och utloggning syns alltid,
  // även medan recensionerna laddas eller om något går fel
  const header = (
    <View style={styles.header}>
      <Text style={styles.title} accessibilityRole="header">
        {username}
      </Text>

      {!loading && !errorMessage && (
        <Text style={styles.text}>
          {reviews.length === 1
            ? 'Du har skrivit 1 recension.'
            : `Du har skrivit ${reviews.length} recensioner.`}
        </Text>
      )}

      <PrimaryButton title="Logga ut" variant="secondary" onPress={handleLogout} />

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Mina recensioner
      </Text>
    </View>
  );

  // Det som visas under rubriken när listan är tom beror på läget
  let emptyContent;

  if (loading) {
    // Medan recensionerna hämtas (US17)
    emptyContent = (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Hämtar dina recensioner...</Text>
      </View>
    );
  } else if (errorMessage) {
    // Om något gick fel (US18), med möjlighet att försöka igen
    emptyContent = (
      <View style={styles.center}>
        <Text style={styles.message} accessibilityRole="alert">
          {errorMessage}
        </Text>
        <PrimaryButton title="Försök igen" onPress={handleRetry} />
      </View>
    );
  } else {
    // Om användaren inte har skrivit några recensioner (US19), inte ett fel
    emptyContent = (
      <View style={styles.center}>
        <Text style={styles.message}>Du har inte skrivit några recensioner ännu.</Text>
        <PrimaryButton
          title="Visa filmer"
          onPress={() => navigation.navigate('MovieList')}
        />
      </View>
    );
  }

  // Medan data laddas eller vid fel visas en tom lista,
  // så att bara rubriken och meddelandet syns
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={loading || errorMessage ? [] : reviews}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderReview}
      ListHeaderComponent={header}
      ListEmptyComponent={emptyContent}
      // Pull-to-refresh: dra listan nedåt för att hämta recensionerna igen
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}

// Utseende för profilen
const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  center: {
    alignItems: 'stretch',
    paddingVertical: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardActions: {
    // Knapparna bredvid varandra, och radbrytning på smala skärmar (US20)
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  cardButton: {
    // Knapparna delar lika på bredden men blir aldrig för smala
    flexGrow: 1,
    minWidth: 90,
  },
});