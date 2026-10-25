# Filmappen

En mobilapp där man kan utforska filmer, läsa vad andra tycker och skriva egna recensioner. Appen är byggd i React Native med Expo och kommunicerar med ett eget REST API byggt i Spring Boot, med en PostgreSQL-databas i Docker.

Individuellt projekt i kursen Mobilutveckling, EC Utbildning.

## Innehåll

- [Funktioner](#funktioner)
- [Teknik](#teknik)
- [Krav för att köra projektet](#krav-för-att-köra-projektet)
- [Installation och start](#installation-och-start)
- [Registrering och inloggning](#registrering-och-inloggning)
- [Lokal lagring](#lokal-lagring)
- [Mobilfunktion](#mobilfunktion)
- [REST API](#rest-api)
- [Projektstruktur](#projektstruktur)
- [Testa API:t med Bruno](#testa-apit-med-bruno)
- [Kända problem och begränsningar](#kända-problem-och-begränsningar)

## Funktioner

**För alla användare**
- Startsida som förklarar appen
- Lista med 18 filmer i 7 genrer
- Sökning på titel, filtrering på genre och sortering (A–Ö, nyaste, äldsta), som kan kombineras
- Detaljvy med filminformation, snittbetyg och alla recensioner
- Spara filmer som favoriter och se dem i en egen lista
- Dela en film via telefonens delningsmeny
- Registrering och inloggning

**För inloggade användare**
- Skriva en recension med betyg 1–10 och valfri text (POST)
- Ändra sin recension (PATCH)
- Ta bort sin recension, med bekräftelsefråga (DELETE)
- Profil med alla egna recensioner, där de kan visas, ändras och tas bort
- Utloggning

**Genom hela appen**
- Laddningsindikator när data hämtas
- Begripliga felmeddelanden, med "Försök igen" där det passar
- Tydliga meddelanden när en lista är tom
- Layout som anpassar sig till skärmens storlek
- Accessibility: etiketter och roller för skärmläsare och knappar som är lätta att trycka på

### VG-stories

- **VG1 – Avancerad sökning, filtrering och sortering:** sökning på titel, filter på genre och sortering kan kombineras, till exempel `?search=in&genre=Sci-Fi&sort=newest`. Sökningen väntar tills användaren har slutat skriva (debounce), och svar på gamla anrop ignoreras om användaren hunnit ändra sökningen.
- **VG6 – Profil och användarspecifik data:** profilen visar den inloggade användarens recensioner, hämtade från `GET /api/users/me/reviews`, där de kan visas, ändras och tas bort.

Detaljvyn hämtar dessutom filmen och recensionerna samtidigt med `Promise.allSettled`, så att filmen visas även om recensionerna inte går att hämta (grund för VG5).

## Teknik

| Del | Teknik |
|---|---|
| App | React Native, Expo (SDK 58), JavaScript |
| Navigation | React Navigation (native stack) |
| Backend | Spring Boot 4, Java 21, Gradle |
| Databas | PostgreSQL 16 i Docker |
| Inloggning | JWT (jjwt), lösenord krypterade med BCrypt |
| Lokal lagring | expo-secure-store, AsyncStorage |

## Krav för att köra projektet

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Java 21
- Node.js (LTS)
- Android Studio med en Android-emulator, eller appen Expo Go på en mobil

Gradle behöver inte installeras. Projektet innehåller Gradle Wrapper (`gradlew`), som laddar ner rätt version automatiskt.

## Installation och start

Starta delarna i den här ordningen: databas, backend och sist appen.

### 1. Klona repot

```bash
git clone https://github.com/alexreichstein/filmapp.git
cd filmapp
```

### 2. Starta databasen

Kontrollera att Docker Desktop är igång.

```bash
cd backend
docker compose up -d
```

Databasen körs på port **5433**, så att den inte krockar med en annan PostgreSQL på standardporten 5432.

### 3. Starta backend

I mappen `backend`:

```bash
# Windows
.\gradlew bootRun

# Mac / Linux
./gradlew bootRun
```

Första gången laddar Gradle ner alla bibliotek, vilket kan ta en stund. Backend är igång när det står `Started BackendApplication`. API:t körs på `http://localhost:8080`.

Tabellerna skapas automatiskt, och 18 filmer läggs in första gången backend startar.

### 4. Starta appen

I en ny terminal, från mappen `filmapp`:

```bash
cd app
npm install
npx expo start
```

- **Android-emulator:** starta emulatorn i Android Studio och tryck `a` i terminalen.
- **Mobil:** skanna QR-koden med Expo Go. Mobilen och datorn måste vara på samma wifi.

Appen hittar backend automatiskt. Den läser datorns adress från Expo och använder port 8080, så ingen adress behöver ändras i koden.

### Stoppa

- Appen och backend: `Ctrl + C` i respektive terminal
- Databasen: `docker compose down` i mappen `backend` (datan finns kvar i en Docker-volym)

## Registrering och inloggning

Det finns inga förinlagda konton. Skapa ett konto i appen under **Skapa konto**.

1. **Registrering:** appen skickar användarnamn (3–30 tecken) och lösenord (minst 6 tecken) till `POST /api/auth/register`. Backend krypterar lösenordet med BCrypt innan det sparas. Efter registreringen loggas användaren in direkt.
2. **Inloggning:** appen skickar användarnamn och lösenord till `POST /api/auth/login`. Om de stämmer svarar backend med en JWT-token som gäller i 24 timmar. Vid fel uppgifter visas "Fel användarnamn eller lösenord", samma meddelande oavsett om användaren saknas eller lösenordet är fel.
3. **Behålla inloggningen:** token sparas i SecureStore. När appen startar läses token och kontrolleras mot `GET /api/users/me`. Om den har gått ut loggas användaren ut automatiskt.
4. **Skyddade anrop:** token skickas med som `Authorization: Bearer <token>`. Backend tar fram användaren ur token och kontrollerar att man bara kan ändra och ta bort sina egna recensioner.
5. **Skyddade skärmar:** profilen och recensionsformuläret finns bara i navigeringen när användaren är inloggad, så de går inte att nå som utloggad.
6. **Utloggning:** token tas bort från SecureStore.

## Lokal lagring

| Data | Lagring | Varför |
|---|---|---|
| JWT-token | `expo-secure-store` | Ger tillgång till kontot och lagras därför krypterat |
| Favoritfilmer | `AsyncStorage` | Vanlig data som inte är känslig |

Lösenord sparas aldrig i appen.

## Mobilfunktion

**Share:** i detaljvyn finns knappen **Dela filmen**, som öppnar telefonens delningsmeny. Användaren kan tipsa en vän om filmen via till exempel SMS eller Messenger. Texten innehåller titel, år, genre, regissör, snittbetyg och beskrivning. Om användaren stänger menyn utan att dela händer ingenting, och om delningen inte går att öppna visas ett felmeddelande.

## REST API

Alla svar är JSON. Fel har alltid formatet `{ "message": "..." }`.

| Metod | Adress | Åtkomst | Beskrivning |
|---|---|---|---|
| POST | `/api/auth/register` | Öppen | Skapa konto |
| POST | `/api/auth/login` | Öppen | Logga in, svarar med token |
| GET | `/api/movies` | Öppen | Alla filmer. Valfritt: `search`, `genre`, `sort` (`title`, `newest`, `oldest`) |
| GET | `/api/movies/genres` | Öppen | Alla genrer |
| GET | `/api/movies/{id}` | Öppen | En film |
| GET | `/api/movies/{id}/reviews` | Öppen | Recensioner för en film |
| POST | `/api/movies/{id}/reviews` | Inloggad | Skriv en recension |
| PATCH | `/api/reviews/{id}` | Bara ägaren | Ändra en recension |
| DELETE | `/api/reviews/{id}` | Bara ägaren | Ta bort en recension |
| GET | `/api/users/me` | Inloggad | Den inloggade användaren |
| GET | `/api/users/me/reviews` | Inloggad | Den inloggade användarens recensioner |

## Projektstruktur

```
filmapp/
├── app/                    Expo-appen
│   ├── api/                Gemensam funktion för alla API-anrop
│   ├── components/         Återanvändbara komponenter (knappar, kort, formulärfält)
│   ├── constants/          Färger
│   ├── context/            AuthContext och FavoritesContext
│   ├── hooks/              Egen hook för att ta bort recensioner
│   ├── navigation/         RootNavigator med öppna och skyddade skärmar
│   ├── screens/            Alla skärmar
│   └── App.js
├── backend/                Spring Boot
│   ├── src/main/java/.../filmapp/
│   │   ├── config/         Säkerhetsinställningar och startdata
│   │   ├── controller/     Tar emot anropen
│   │   ├── dto/            Data som skickas in och ut
│   │   ├── exception/      Gemensam felhantering
│   │   ├── model/          Movie, User, Review
│   │   ├── repository/     Kopplingen till databasen
│   │   ├── security/       JWT och filtret som kontrollerar token
│   │   └── service/        Logiken
│   └── compose.yaml        Databasen i Docker
└── api-tests/              Testanrop för Bruno
```

## Testa API:t med Bruno

Mappen `api-tests` innehåller testanrop för [Bruno](https://www.usebruno.com/). Öppna den med **Open Collection** i Bruno. Kör **Register** och **Login** först, och använd token från Login i de skyddade anropen.

## Kända problem och begränsningar

- **Inga affischer.** Filmerna saknar bilder, och appen visar en ruta med filmens första bokstav istället. Om en film får en bildlänk i databasen visas bilden automatiskt.
- **Favoriterna är lokala.** De sparas på telefonen och är inte kopplade till kontot. Två personer som delar telefon delar alltså favoriter, och favoriterna följer inte med till en annan telefon.
- **Snittbetyget syns bara i detaljvyn.** Det räknas ut i appen från recensionerna och visas därför inte i filmlistan.
- **Delning på Android.** Android talar inte om ifall användaren faktiskt delade eller stängde menyn, så appen visar ingen bekräftelse efter delning.
- **Ingen förnyelse av token.** Token gäller i 24 timmar, sedan måste användaren logga in igen.
- **Inga kontoinställningar.** Det går inte att byta lösenord eller ta bort sitt konto.
- **Ingen paginering.** Alla filmer hämtas på en gång, vilket fungerar för de 18 filmerna men inte skulle skala för väldigt många.
- **Uppgifter för lokal utveckling i repot.** Databaslösenordet i `compose.yaml` och reservnyckeln för JWT i `application.properties` finns med så att projektet går att starta direkt. De gäller bara en lokal testdatabas. I en riktig drift skulle de anges som miljövariabler (JWT-nyckeln läses redan i första hand från `JWT_SECRET`).
- **Testad på Android.** Appen är utvecklad och testad på en Android-emulator. Den är inte testad på iOS.
- **Brandvägg på en riktig mobil.** Om appen inte når backend från en mobil kan Windows brandvägg behöva tillåta Java på port 8080. På Android-emulatorn behövs inget sådant.