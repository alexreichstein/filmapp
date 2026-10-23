import { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from '../constants/colors.js';
import { AuthContext } from '../context/AuthContext.js';
import FavoritesScreen from '../screens/FavoritesScreen.js';
import HomeScreen from '../screens/HomeScreen.js';
import LoginScreen from '../screens/LoginScreen.js';
import MovieDetailsScreen from '../screens/MovieDetailsScreen.js';
import MovieListScreen from '../screens/MovieListScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';
import RegisterScreen from '../screens/RegisterScreen.js';
import ReviewFormScreen from '../screens/ReviewFormScreen.js';

// Skapar stack-navigeringen. Skärmarna läggs "på varandra",
// och tillbaka-knappen tar bort den översta
const Stack = createNativeStackNavigator();

// Alla skärmar i appen.
// Ligger i en egen fil så att den kan läsa inloggningen från AuthContext
export default function RootNavigator() {
  const { isLoggedIn, isRestoring } = useContext(AuthContext);

  // Medan appen kontrollerar en sparad token visas en laddningsindikator,
  // så att användaren inte ser fel skärmar en kort stund
  if (isRestoring) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Öppna skärmar finns alltid.
  // Skyddade skärmar registreras bara när användaren är inloggad (US6),
  // så en utloggad användare kan inte navigera dit ens med navigation.navigate().
  // Loggar användaren ut försvinner de skyddade skärmarna automatiskt
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Startsida' }}
        />
        <Stack.Screen
          name="MovieList"
          component={MovieListScreen}
          options={{ title: 'Filmer' }}
        />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen}
          // Rubriken blir filmens titel, som skickas med från listan
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ title: 'Mina favoriter' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Logga in' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Skapa konto' }}
        />
      </Stack.Group>

      {isLoggedIn && (
        <Stack.Group>
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Min profil' }}
          />
          <Stack.Screen
            name="ReviewForm"
            component={ReviewFormScreen}
            // Rubriken beror på om en recension skickades med (ändra) eller inte (skriv)
            options={({ route }) => ({
              title: route.params.review ? 'Ändra recension' : 'Skriv recension',
            })}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

// Utseende för laddningsskärmen
const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});