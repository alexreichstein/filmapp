import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import { apiRequest } from '../api/client.js';
import { AuthContext } from '../context/AuthContext.js';

// Egen hook för att ta bort en recension (US12).
// Används på flera skärmar (detaljvyn och profilen),
// så logiken för bekräftelse, anrop och fel finns bara på ett ställe
export default function useDeleteReview() {
  const { token, logout } = useContext(AuthContext);

  // Id:t på recensionen som håller på att tas bort, null om ingen.
  // Används för att visa en snurra på rätt knapp
  const [deletingId, setDeletingId] = useState(null);

  // Frågar användaren innan något tas bort, eftersom det inte går att ångra.
  // onDeleted anropas med recensionens id när borttagningen har lyckats
  function confirmDelete(review, onDeleted) {
    Alert.alert(
      'Ta bort recension',
      'Vill du ta bort din recension? Det går inte att ångra.',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: () => deleteReview(review, onDeleted),
        },
      ]
    );
  }

  // Skickar DELETE till backend
  async function deleteReview(review, onDeleted) {
    setDeletingId(review.id);

    try {
      const result = await apiRequest(`/api/reviews/${review.id}`, {
        method: 'DELETE',
        token,
      });

      // Låter skärmen uppdatera sin lista
      onDeleted(review.id);

      // Tydlig återkoppling (US12, US14), med backendens meddelande
      Alert.alert('Borttagen', result?.message ?? 'Recensionen har tagits bort.');
    } catch (error) {
      // 401 betyder att inloggningen har gått ut
      if (error.status === 401) {
        await logout();
        Alert.alert('Utloggad', 'Din inloggning har gått ut. Logga in igen.');
        return;
      }

      // Övriga fel, till exempel om servern inte går att nå
      Alert.alert('Kunde inte ta bort', error.message);
    } finally {
      setDeletingId(null);
    }
  }

  return { confirmDelete, deletingId };
}