import { useContext, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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

      // Tydlig återkoppling (US14) och tillbaka till startsidan
      Alert.alert('Välkommen!', `Ditt konto har skapats och du är inloggad som ${trimmedUsername}.`);
      navigation.popToTop();
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

        <Text style={styles.label}>Användarnamn</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="3–30 tecken"
          // Ingen stor bokstav eller autokorrigering i användarnamn
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          accessibilityLabel="Användarnamn"
        />

        <Text style={styles.label}>Lösenord</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Minst 6 tecken"
          // Döljer lösenordet med punkter
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          accessibilityLabel="Lösenord"
        />

        <Text style={styles.label}>Upprepa lösenord</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Samma lösenord igen"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          accessibilityLabel="Upprepa lösenord"
          // Enter på tangentbordet skickar formuläret
          onSubmitEditing={handleRegister}
        />

        {errorMessage && (
          <Text
            style={styles.error}
            // Skärmläsare läser upp felet direkt när det visas
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {errorMessage}
          </Text>
        )}

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
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  error: {
    color: '#b91c1c',
    fontSize: 16,
    marginBottom: 16,
  },
  buttonArea: {
    marginTop: 8,
  },
});