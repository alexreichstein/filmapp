import { StyleSheet, Text, TextInput, View } from 'react-native';

import colors from '../constants/colors.js';

// Ett formulärfält: en rubrik och ett textfält under.
// label:      rubriken, används även som accessibilityLabel
// style:      extra stil för textfältet, till exempel större höjd för långa texter
// inputProps: allt annat (value, onChangeText, secureTextEntry ...)
//             skickas vidare till TextInput oförändrat
export default function FormField({ label, style, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        // Skärmläsare läser upp rubriken när fältet får fokus
        accessibilityLabel={label}
        // Tydlig färg på platshållartexten så att den syns
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
    </View>
  );
}

// Utseende för fältet
const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});