import { Pressable, StyleSheet, Text } from 'react-native';

// Liten valbar knapp, används för genrer och sortering.
// label:    texten på knappen
// selected: om knappen är vald just nu
// onPress:  vad som händer vid tryck
// accessibilityLabel: text för skärmläsare, annars används label
export default function Chip({ label, selected, onPress, accessibilityLabel }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      // Skärmläsare får veta att det är en knapp och om den är vald
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

// Utseende för knappen
const styles = StyleSheet.create({
  chip: {
    // Minst 44 punkter hög så att den är lätt att trycka på
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#1e3a8a',
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  selectedText: {
    color: '#fff',
  },
});