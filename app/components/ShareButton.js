import { useState } from 'react';
import { Alert, Share } from 'react-native';

import PrimaryButton from './PrimaryButton.js';

// Bygger texten som delas.
// Snittbetyget tas bara med om filmen har recensioner
function buildShareMessage(movie, averageRating, reviewCount) {
  const lines = [
    `Tips från Filmappen: ${movie.title} (${movie.releaseYear})`,
    `${movie.genre} · Regi: ${movie.director}`,
  ];

  if (averageRating) {
    lines.push(`Snittbetyg ${averageRating}/10 från ${reviewCount} recensioner`);
  }

  // Tom rad mellan uppgifterna och beskrivningen
  lines.push('', movie.description);

  // Raderna sätts ihop med radbrytning
  return lines.join('\n');
}

// Knapp som delar en film via telefonens delningsmeny (US16).
// movie:         filmen som ska delas
// averageRating: snittbetyget som text, eller null om recensioner saknas
// reviewCount:   antal recensioner
export default function ShareButton({ movie, averageRating, reviewCount }) {
  // True medan delningsmenyn är öppen, så att den inte öppnas två gånger
  const [sharing, setSharing] = useState(false);

  // Öppnar delningsmenyn
  async function handleShare() {
    setSharing(true);

    try {
      // Share.share öppnar telefonens vanliga delningsmeny.
      // Promisen blir klar först när menyn stängs.
      // Stänger användaren menyn utan att dela är det inget fel, och ingenting händer.
      // På Android går det inte att veta om användaren faktiskt delade,
      // därför visas ingen ruta med "filmen har delats"
      await Share.share({
        message: buildShareMessage(movie, averageRating, reviewCount),
        title: movie.title,
      });
    } catch (error) {
      // Om delningen inte går att öppna loggas felet och användaren får ett meddelande
      console.log('Kunde inte dela:', error);
      Alert.alert('Kunde inte dela', 'Delningen gick inte att öppna. Försök igen.');
    } finally {
      setSharing(false);
    }
  }

  return (
    <PrimaryButton
      title="Dela filmen"
      variant="secondary"
      accessibilityLabel={`Dela ${movie.title}`}
      // Avstängd medan menyn är öppen, utan snurra eftersom menyn själv syns
      disabled={sharing}
      onPress={handleShare}
    />
  );
}