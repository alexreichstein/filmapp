import { StyleSheet, Text } from 'react-native';

// Visar ett felmeddelande i rött.
// Om message är tomt visas ingenting, så skärmarna kan alltid ha komponenten på plats
export default function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <Text
      style={styles.error}
      // Skärmläsare läser upp felet direkt när det visas
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {message}
    </Text>
  );
}

// Utseende för felmeddelandet
const styles = StyleSheet.create({
  error: {
    color: '#b91c1c',
    fontSize: 16,
    marginBottom: 16,
  },
});