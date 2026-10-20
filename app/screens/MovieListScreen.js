import { StyleSheet, Text, View } from 'react-native';

// Filmlistan. Just nu bara en platshållare,
// senare hämtas filmerna från API:t här
export default function MovieListScreen() {
  return (
    <View style={styles.container}>
      <Text>Här kommer filmerna att visas.</Text>
    </View>
  );
}

// Utseende för filmlistan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});