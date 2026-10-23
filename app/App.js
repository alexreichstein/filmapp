import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './context/AuthContext.js';
import { FavoritesProvider } from './context/FavoritesContext.js';
import RootNavigator from './navigation/RootNavigator.js';

// Appens startpunkt.
// AuthProvider och FavoritesProvider ligger ytterst så att alla skärmar
// kan läsa inloggningen och favoriterna.
// NavigationContainer håller koll på var i appen användaren befinner sig
export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
      </FavoritesProvider>
    </AuthProvider>
  );
}