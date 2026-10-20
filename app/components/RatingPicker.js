import { Pressable, StyleSheet, Text, View } from 'react-native';

// Betygen 1 till 10 som en lista: [1, 2, 3, ..., 10]
const RATINGS = Array.from({ length: 10 }, (_, index) => index + 1);

// Rad med knappar för att välja ett betyg mellan 1 och 10.
// value:    det valda betyget, eller null om inget är valt
// onChange: anropas med det nya betyget när användaren trycker
export default function RatingPicker({ value, onChange }) {
  return (
    <View
      style={styles.row}
      // Skärmläsare behandlar knapparna som en grupp av radioknappar
      accessibilityRole="radiogroup"
      accessibilityLabel="Betyg"
    >
      {RATINGS.map((rating) => {
        const isSelected = rating === value;

        return (
          <Pressable
            key={rating}
            style={[styles.option, isSelected && styles.selected]}
            onPress={() => onChange(rating)}
            // Läses upp som till exempel "Betyg 8 av 10, vald"
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={`Betyg ${rating} av 10`}
          >
            <Text style={[styles.optionText, isSelected && styles.selectedText]}>
              {rating}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Utseende för betygsväljaren
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    // Knapparna radbryts på smala skärmar istället för att hamna utanför (US20)
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  option: {
    // 48 x 48 så att knapparna är lätta att trycka på
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#1e3a8a',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  selectedText: {
    color: '#fff',
  },
});