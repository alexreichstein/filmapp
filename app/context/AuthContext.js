import { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { apiRequest } from '../api/client.js';

// Namnet som token sparas under i SecureStore
const TOKEN_KEY = 'authToken';

// Contexten som skärmarna hämtar inloggningen från med useContext
const AuthContext = createContext();

// Omsluter hela appen och delar inloggningen med alla skärmar
function AuthProvider({ children }) {
  // Token från backend, null betyder utloggad
  const [token, setToken] = useState(null);

  // Den inloggade användarens namn
  const [username, setUsername] = useState(null);

  // True medan appen kontrollerar en sparad token vid start
  const [isRestoring, setIsRestoring] = useState(true);

  // Körs en gång när appen startar
  useEffect(() => {
    restoreLogin();
  }, []);

  // Läser en sparad token och kontrollerar att den fortfarande gäller
  async function restoreLogin() {
    try {
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      // Ingen sparad token: användaren är utloggad
      if (!savedToken) {
        return;
      }

      // Frågar backend vem token tillhör. Är den ogiltig eller utgången kastas ett fel
      const user = await apiRequest('/api/users/me', { token: savedToken });

      setToken(savedToken);
      setUsername(user.username);
    } catch (error) {
      console.log('Kunde inte återställa inloggningen:', error);

      // 401 betyder att token inte gäller längre, så den tas bort.
      // Vid andra fel, till exempel om servern inte går att nå,
      // behålls token så att den kan provas igen vid nästa start
      if (error.status === 401) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } finally {
      setIsRestoring(false);
    }
  }

  // Loggar in: hämtar en token från backend och sparar den i SecureStore.
  // Fel skickas vidare till skärmen, som visar meddelandet för användaren
  async function login(usernameInput, password) {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { username: usernameInput, password },
    });

    // Lösenordet sparas aldrig, bara token
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);

    setToken(result.token);
    setUsername(result.username);
  }

  // Skapar ett konto och loggar sedan in direkt,
  // så att användaren slipper skriva in uppgifterna två gånger
  async function register(usernameInput, password) {
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { username: usernameInput, password },
    });

    await login(usernameInput, password);
  }

  // Loggar ut: tar bort token från SecureStore och nollställer state
  async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isLoggedIn: token !== null,
        isRestoring,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };