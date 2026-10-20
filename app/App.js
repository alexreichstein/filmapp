import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen.js';
import MovieListScreen from './screens/MovieListScreen.js';

// Skapar stack-navigeringen. Skärmarna läggs "på varandra",
// och tillbaka-knappen tar bort den översta
const Stack = createNativeStackNavigator();

// Appens startpunkt.
// NavigationContainer håller koll på var i appen användaren befinner sig.
// Varje Stack.Screen är en skärm: name används i navigation.navigate(),
// och title är rubriken som visas överst
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}