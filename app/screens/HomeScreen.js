import { useContext } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton.js';
import { AuthContext } from '../context/AuthContext.js';

// Startsidan (US1). Förklarar appens syfte och leder vidare.
// navigation skickas in automatiskt av React Navigation
export default function HomeScreen({ navigation }) {
  const { isLoggedIn, username, logout } = useContext(AuthContext);

  // Loggar ut och bekräftar det för användaren (US14)
  async function handleLogout() {
    await logout();
    Alert.alert('Utloggad', 'Du är nu utloggad.');
  }

  // Inloggad: visar namnet och en utloggningsknapp.
  // Utloggad: visar knappar för att logga in eller skapa konto
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmappen</Text>
      <Text style={styles.text}>
        Utforska filmer, läs vad andra tycker och skriv egna recensioner.
      </Text>

      {isLoggedIn && <Text style={styles.loggedIn}>Inloggad som {username}</Text>}

      <View style={styles.buttons}>
        <PrimaryButton
          title="Visa filmer"
          accessibilityLabel="Visa alla filmer"
          onPress={() => navigation.navigate('MovieList')}
        />

        {isLoggedIn ? (
          <PrimaryButton
            title="Logga ut"
            variant="secondary"
            onPress={handleLogout}
          />
        ) : (
          <>
            <PrimaryButton
              title="Logga in"
              variant="secondary"
              onPress={() => navigation.navigate('Login')}
            />
            <PrimaryButton
              title="Skapa konto"
              variant="secondary"
              onPress={() => navigation.navigate('Register')}
            />
          </>
        )}
      </View>
    </View>
  );
}

// Utseende för startsidan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
  },
  loggedIn: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttons: {
    // Avstånd mellan knapparna
    gap: 12,
  },
});