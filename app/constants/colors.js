// Alla färger i appen, samlade på ett ställe.
// Namnen beskriver vad färgen används till, så att en färg
// kan ändras i hela appen genom att ändra den här.
const colors = {
  // Huvudfärg: knappar, valda alternativ, betyg och länkar
  primary: '#1e3a8a',

  // Knappar som tar bort något
  danger: '#b91c1c',

  // Felmeddelanden
  error: '#b91c1c',

  // Vit: text på färgade knappar, kort och skärmar
  white: '#fff',

  // Ljusgrå bakgrund bakom listor
  background: '#f3f4f6',

  // Kanter på kort och avdelare
  border: '#e5e7eb',

  // Kanter på textfält
  inputBorder: '#ccc',

  // Mindre viktig text, till exempel år, genre och regissör
  textSecondary: '#4b5563',

  // Ännu svagare text: datum, platshållartext och teckenräknare
  textMuted: '#6b7280',

  // Platshållaren när en film saknar affisch
  posterPlaceholder: '#cbd5e1',
  posterPlaceholderText: '#475569',

  // Favoritknappen
  favorite: '#be123c',
  favoriteBackground: '#ffe4e6',
};

export default colors;