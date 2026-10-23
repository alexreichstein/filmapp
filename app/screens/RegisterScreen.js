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

import ErrorMessage from '../components/ErrorMessage.js';
import FormField from '../components/FormField.js';
import PrimaryButton from '../components/PrimaryButton.js';
import { AuthContext } from '../context/AuthContext.js';

// Skärm för att skapa ett nytt konto (US3)
export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);

  // Det användaren skriver i fälten
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // True medan anropet till backend pågår
  const [loading, setLoading] = useState(false);

  // Felmeddelande som visas under formuläret
  const [errorMessage, setErrorMessage] = useState(null);

  // Körs när användaren trycker på "Skapa konto"
  async function handleRegister() {
    // Tar bort mellanslag i början och slutet av användarnamnet
    const trimmedUsername = username.trim();

    // Enkla kontroller i appen innan något skickas.
    // Längdkraven kontrolleras av backend, som skickar tillbaka sitt meddelande
    if (!trimmedUsername || !password) {
      setErrorMessage('Fyll i användarnamn och lösenord.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Lösenorden matchar inte.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Skapar kontot och loggar in direkt (se AuthContext)
      await register(trimmedUsername, password);

      // Tydlig återkoppling (US14).
      // goBack tar användaren tillbaka dit hen var innan,
      // till exempel till filmen hen ville recensera
      Alert.alert('Välkommen!', `Ditt konto har skapats och du är inloggad som ${trimmedUsername}.`);
      navigation.goBack();
    } catch (error) {
      // error.message är ett begripligt meddelande, till exempel från backend
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
        <Text style={styles.title}>Skapa konto</Text>

        <FormField
          label="Användarnamn"
          value={username}
          onChangeText={setUsername}
          placeholder="3–30 tecken"
          // Ingen stor bokstav eller autokorrigering i användarnamn
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
        />

        <FormField
          label="Lösenord"
          value={password}
          onChangeText={setPassword}
          placeholder="Minst 6 tecken"
          // Döljer lösenordet med punkter
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
        />

        <FormField
          label="Upprepa lösenord"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Samma lösenord igen"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          // Enter på tangentbordet skickar formuläret
          onSubmitEditing={handleRegister}
        />

        <ErrorMessage message={errorMessage} />

        <View style={styles.buttonArea}>
          <PrimaryButton
            title="Skapa konto"
            onPress={handleRegister}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Utseende för registreringsskärmen
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonArea: {
    marginTop: 8,
  },
});