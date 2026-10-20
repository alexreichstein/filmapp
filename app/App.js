import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './context/AuthContext.js';
import RootNavigator from './navigation/RootNavigator.js';

// Appens startpunkt.
// AuthProvider ligger ytterst så att alla skärmar kan läsa inloggningen.
// NavigationContainer håller koll på var i appen användaren befinner sig
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}