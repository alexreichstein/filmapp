import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

// Återanvändbar knapp som används i hela appen.
// title:    texten på knappen
// onPress:  vad som händer vid tryck
// loading:  visar en snurra och stänger av knappen medan något pågår
// disabled: stänger av knappen
// variant:  'primary' (fylld), 'secondary' (ljus med kantlinje)
//           eller 'danger' (röd, för att ta bort något)
// accessibilityLabel: text för skärmläsare, annars används title
export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  accessibilityLabel,
}) {
  // Knappen går inte att trycka på om den är avstängd eller något pågår
  const isDisabled = disabled || loading;
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      // Stilen byggs av flera delar: grundstil, variant, nedtryckt och avstängd
      style={({ pressed }) => [
        styles.button,
        isSecondary && styles.secondary,
        isDanger && styles.danger,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      // Talar om för skärmläsare att det är en knapp och vilket läge den har
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? '#1e3a8a' : '#fff'} />
      ) : (
        <Text style={[styles.text, isSecondary && styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

// Utseende för knappen
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1e3a8a',
    // Minst 48 punkter hög så att den är lätt att trycka på
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1e3a8a',
  },
  danger: {
    backgroundColor: '#b91c1c',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#1e3a8a',
  },
});