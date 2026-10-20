import { Pressable, StyleSheet, Text, View } from 'react-native';

// Startsidan (US1). Förklarar appens syfte och leder vidare till filmerna.
// navigation skickas in automatiskt av React Navigation
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmappen</Text>
      <Text style={styles.text}>
        Utforska filmer, läs vad andra tycker och skriv egna recensioner.
      </Text>

      <Pressable
        style={styles.button}
        // Talar om för skärmläsare vad knappen gör (accessibility)
        accessibilityRole="button"
        accessibilityLabel="Visa alla filmer"
        // Byter till filmlistan
        onPress={() => navigation.navigate('MovieList')}
      >
        <Text style={styles.buttonText}>Visa filmer</Text>
      </Pressable>
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
  button: {
    backgroundColor: '#1e3a8a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});