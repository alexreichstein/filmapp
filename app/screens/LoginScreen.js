import { useContext, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import PrimaryButton from '../components/PrimaryButton.js';
import { AuthContext } from '../context/AuthContext.js';

// Skärm för inloggning (US4)
export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  // Det användaren skriver i fälten
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // True medan anropet till backend pågår
  const [loading, setLoading] = useState(false);

  // Felmeddelande som visas under formuläret
  const [errorMessage, setErrorMessage] = useState(null);

  // Körs när användaren trycker på "Logga in"
  async function handleLogin() {
    const trimmedUsername = username.trim();

    // Kontrollerar att båda fälten är ifyllda innan något skickas
    if (!trimmedUsername || !password) {
      setErrorMessage('Fyll i användarnamn och lösenord.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Hämtar token från backend och sparar den i SecureStore (se AuthContext)
      await login(trimmedUsername, password);

      // Tydlig återkoppling (US14) och tillbaka till startsidan
      Alert.alert('Inloggad', `Välkommen tillbaka, ${trimmedUsername}!`);
      navigation.popToTop();
    } catch (error) {
      // Vid fel uppgifter: "Fel användarnamn eller lösenord" från backend
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
        <Text style={styles.title}>Logga in</Text>

        <Text style={styles.label}>Användarnamn</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
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
          // Döljer lösenordet med punkter
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          accessibilityLabel="Lösenord"
          // Enter på tangentbordet skickar formuläret
          onSubmitEditing={handleLogin}
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
            title="Logga in"
            onPress={handleLogin}
            loading={loading}
          />
        </View>

        <Pressable
          style={styles.link}
          accessibilityRole="link"
          accessibilityLabel="Har du inget konto? Skapa konto"
          // replace byter ut inloggningen mot registreringen,
          // så att tillbaka-pilen leder till startsidan
          onPress={() => navigation.replace('Register')}
        >
          <Text style={styles.linkText}>Har du inget konto? Skapa konto</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Utseende för inloggningsskärmen
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
  link: {
    // Tillräckligt stor yta för att vara lätt att trycka på
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  linkText: {
    color: '#1e3a8a',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});