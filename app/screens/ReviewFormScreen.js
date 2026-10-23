import { useContext, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { apiRequest } from '../api/client.js';
import ErrorMessage from '../components/ErrorMessage.js';
import FormField from '../components/FormField.js';
import PrimaryButton from '../components/PrimaryButton.js';
import RatingPicker from '../components/RatingPicker.js';
import colors from '../constants/colors.js';
import { AuthContext } from '../context/AuthContext.js';

// Samma gräns som i backend
const MAX_TEXT_LENGTH = 1000;

// Formulär för att skriva (US10) eller ändra (US11) en recension.
// Skyddad skärm: finns bara för inloggade användare (US6).
// route.params innehåller movieId och movieTitle,
// och review om en befintlig recension ska ändras
export default function ReviewFormScreen({ route, navigation }) {
  const { movieId, movieTitle, review } = route.params;

  // Om en recension skickades med är det ändringsläge
  const isEditing = review !== undefined;

  const { token, logout } = useContext(AuthContext);

  // Fälten är förifyllda i ändringsläge, annars tomma
  const [rating, setRating] = useState(review?.rating ?? null);
  const [text, setText] = useState(review?.text ?? '');

  // True medan anropet till backend pågår
  const [loading, setLoading] = useState(false);

  // Felmeddelande som visas under formuläret
  const [errorMessage, setErrorMessage] = useState(null);

  // Körs när användaren trycker på "Spara"
  async function handleSave() {
    // Betyget är obligatoriskt, texten är valfri
    if (rating === null) {
      setErrorMessage('Välj ett betyg mellan 1 och 10.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // En tom text tar bort texten från recensionen
    const body = { rating, text: text.trim() };

    try {
      if (isEditing) {
        // Ändrar den befintliga recensionen (US11)
        await apiRequest(`/api/reviews/${review.id}`, { method: 'PATCH', body, token });
        Alert.alert('Uppdaterad', 'Din recension har uppdaterats.');
      } else {
        // Skapar en ny recension (US10)
        await apiRequest(`/api/movies/${movieId}/reviews`, { method: 'POST', body, token });
        Alert.alert('Sparad', 'Din recension har sparats.');
      }

      // Tillbaka till skärmen innan, som hämtar recensionerna igen
      navigation.goBack();
    } catch (error) {
      // 401 betyder att inloggningen har gått ut.
      // Användaren loggas ut, och skärmen försvinner eftersom den är skyddad
      if (error.status === 401) {
        await logout();
        Alert.alert('Utloggad', 'Din inloggning har gått ut. Logga in igen.');
        return;
      }

      // Övriga fel visas i formuläret, till exempel
      // "Du har redan recenserat den här filmen" från backend
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // KeyboardAvoidingView och ScrollView gör att formuläret inte döljs
  // av tangentbordet och fungerar även på små skärmar (US20)
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.movieTitle} accessibilityRole="header">
          {movieTitle}
        </Text>

        <Text style={styles.label}>Betyg</Text>
        <RatingPicker value={rating} onChange={setRating} />

        <FormField
          label="Recension (valfri)"
          value={text}
          onChangeText={setText}
          placeholder="Vad tyckte du om filmen?"
          // Flera rader för längre texter
          multiline
          textAlignVertical="top"
          // Det går inte att skriva mer än backend tillåter
          maxLength={MAX_TEXT_LENGTH}
          style={styles.textArea}
        />

        <Text
          style={styles.counter}
          accessibilityLabel={`${text.length} av ${MAX_TEXT_LENGTH} tecken`}
        >
          {text.length}/{MAX_TEXT_LENGTH}
        </Text>

        <ErrorMessage message={errorMessage} />

        <View style={styles.buttonArea}>
          <PrimaryButton
            title={isEditing ? 'Spara ändringar' : 'Spara recension'}
            onPress={handleSave}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Utseende för formuläret
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    padding: 20,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  textArea: {
    minHeight: 140,
  },
  counter: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 16,
  },
  buttonArea: {
    marginTop: 8,
  },
});