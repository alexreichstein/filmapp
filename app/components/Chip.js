import { Pressable, StyleSheet, Text } from 'react-native';

import colors from '../constants/colors.js';

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
    borderColor: colors.primary,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  selectedText: {
    color: colors.white,
  },
});