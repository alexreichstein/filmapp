import Constants from 'expo-constants';

// Räknar ut adressen till backend automatiskt.
// Expo vet vilken dator appens kod laddas från, till exempel "192.168.50.194:8081".
// Backend körs på samma dator men på port 8080, så vi byter bara ut porten.
// Då fungerar appen på vilken dator och vilket nätverk som helst utan ändringar.
function getApiUrl() {
  const hostUri = Constants.expoConfig?.hostUri;

  if (hostUri) {
    // Plockar ut IP-adressen, alltså allt före kolonet
    const host = hostUri.split(':')[0];
    return `http://${host}:8080`;
  }

  // Reserv om Expo inte skickar någon adress:
  // 10.0.2.2 är Android-emulatorns standardadress till datorns localhost
  return 'http://10.0.2.2:8080';
}

// Adressen till backend som alla anrop använder
export const API_URL = getApiUrl();

// Egen feltyp för API-fel.
// Innehåller både ett meddelande som kan visas för användaren
// och statuskoden, så att skärmarna kan reagera olika på till exempel 401
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Standardmeddelanden om backend inte skickar något eget
function getDefaultMessage(status) {
  if (status === 401) {
    return 'Du behöver logga in igen.';
  }
  if (status === 403) {
    return 'Du har inte behörighet att göra detta.';
  }
  if (status === 404) {
    return 'Innehållet hittades inte.';
  }
  if (status >= 500) {
    return 'Något gick fel på servern. Försök igen senare.';
  }
  return 'Något gick fel. Försök igen.';
}

// Läser svaret som JSON på ett säkert sätt.
// Vissa svar saknar innehåll (till exempel 401 från Spring Security),
// och då returneras null istället för att appen kraschar
async function readJson(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Gemensam funktion för alla anrop till backend.
// path:   till exempel '/api/movies'
// method: GET, POST, PATCH eller DELETE (GET om inget anges)
// body:   data som ska skickas, görs om till JSON automatiskt
// token:  JWT-token för skyddade anrop
export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = {};

  // Talar om för backend att vi skickar JSON, bara om det finns data
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  // Skickar med token för skyddade anrop
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    // fetch kastar fel om servern inte går att nå alls,
    // till exempel om backend inte är startad.
    // Det tekniska felet loggas för utvecklaren
    console.log('Nätverksfel:', error);
    throw new ApiError('Kunde inte nå servern. Kontrollera anslutningen och försök igen.', 0);
  }

  const data = await readJson(response);

  // Felaktiga svar (400, 401, 404, 409, 500 ...) blir ett ApiError.
  // Vi använder backendens eget meddelande om det finns
  if (!response.ok) {
    console.log(`API-fel ${response.status} på ${method} ${path}`, data);
    const message = data?.message ?? getDefaultMessage(response.status);
    throw new ApiError(message, response.status);
  }

  return data;
}