import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Namnet som favoriterna sparas under i AsyncStorage
const STORAGE_KEY = 'favorites';

// Contexten som skärmarna hämtar favoriterna från med useContext
const FavoritesContext = createContext();

// Omsluter appen och delar favoriterna med alla skärmar.
// Favoriterna sparas lokalt i AsyncStorage så att de finns kvar mellan appstarter (US15)
function FavoritesProvider({ children }) {
  // Listan med favoritfilmer
  const [favorites, setFavorites] = useState([]);

  // Läser sparade favoriter en gång när appen startar
  useEffect(() => {
    loadFavorites();
  }, []);

  // Hämtar favoriterna från AsyncStorage.
  // AsyncStorage sparar bara text, så JSON.parse gör om texten till en lista igen
  async function loadFavorites() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        setFavorites(JSON.parse(data));
      }
    } catch (error) {
      // Går de inte att läsa börjar appen med en tom lista
      console.log('Kunde inte läsa favoriter:', error);
    }
  }

  // Kontrollerar om en film är favorit
  function isFavorite(movieId) {
    return favorites.some((movie) => movie.id === movieId);
  }

  // Lägger till eller tar bort en film från favoriterna.
  // Returnerar true om filmen lades till och false om den togs bort
  async function toggleFavorite(movie) {
    // Sparar den gamla listan, så att den kan återställas om något går fel
    const previousFavorites = favorites;
    const alreadyFavorite = isFavorite(movie.id);

    let updatedFavorites;

    if (alreadyFavorite) {
      // Tar bort filmen ur listan
      updatedFavorites = favorites.filter((favorite) => favorite.id !== movie.id);
    } else {
      // Lägger till filmens viktigaste uppgifter, så att favoritlistan
      // kan visas direkt utan att hämta varje film från API:t
      updatedFavorites = [
        ...favorites,
        {
          id: movie.id,
          title: movie.title,
          releaseYear: movie.releaseYear,
          genre: movie.genre,
          director: movie.director,
          posterUrl: movie.posterUrl,
        },
      ];
    }

    // Uppdaterar skärmen direkt, innan sparandet är klart
    setFavorites(updatedFavorites);

    try {
      // JSON.stringify gör om listan till text, eftersom AsyncStorage bara sparar text
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
      return !alreadyFavorite;
    } catch (error) {
      // Gick det inte att spara återställs listan, och skärmen får ett fel att visa
      console.log('Kunde inte spara favoriter:', error);
      setFavorites(previousFavorites);
      throw new Error('Kunde inte spara favoriten. Försök igen.');
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export { FavoritesContext, FavoritesProvider };