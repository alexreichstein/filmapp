import { useContext } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton.js';
import { AuthContext } from '../context/AuthContext.js';

// Profilen för den inloggade användaren.
// Skyddad skärm: finns bara i navigeringen när användaren är inloggad (US6).
// Senare visas användarens egna recensioner här (VG6)
export default function ProfileScreen() {
  const { username, logout } = useContext(AuthContext);

  // Loggar ut och bekräftar det för användaren (US5, US14).
  // Skärmen försvinner automatiskt eftersom den bara finns för inloggade
  async function handleLogout() {
    await logout();
    Alert.alert('Utloggad', 'Du är nu utloggad.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{username}</Text>
      <Text style={styles.text}>Här kommer dina recensioner att visas.</Text>

      <PrimaryButton
        title="Logga ut"
        variant="secondary"
        onPress={handleLogout}
      />
    </View>
  );
}

// Utseende för profilen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
  },
});