# Costa Rica Abenteuer – Uncharted Map

Eine interaktive Karte eurer Costa-Rica-Reise im Stil einer Uncharted-Schatzkarte.

## Öffnen

**Option 1 – Direkt im Browser:**  
`index.html` doppelklicken oder per Rechtsklick → „Öffnen mit“ → Browser wählen.

**Option 2 – Lokaler Server (empfohlen):**
```bash
# Mit Python 3
python3 -m http.server 8000

# Mit npx
npx serve .
```
Dann im Browser: `http://localhost:8000`

## Features

- **Uncharted-Style:** Sepia-Look, Papiertextur, Vintage-Typografie
- **Interaktive Pins:** Klick auf einen Pin für Details
- **Reiseinfos:** Tag, Aktivitäten, Fahrtdauer, Unterkunftskosten
- **Links:** mibus.cr, Jeep-Boat-Jeep, GetYourGuide, Airbnb
- **Route:** Verbindungslinie zwischen allen Stationen

## Eigene Bilder

Die Bilder kommen von Unsplash. Für eigene Fotos: Nach der Reise die URLs in `index.html` im Objekt `images` anpassen.

## Notizen (Vercel)

**Mit Vercel:** Notizen werden in `data.json` im Repo gespeichert – global, von jedem Gerät.

**Einrichtung (einmalig):**
1. Repo bei [Vercel](https://vercel.com) importieren & deployen
2. **Settings** → **Environment Variables**:
   - `GITHUB_TOKEN`: [Personal Access Token](https://github.com/settings/tokens) mit `repo`-Berechtigung
   - `GITHUB_REPO`: `dein-username/dein-repo`
3. Neu deployen

**Ohne Vercel:** Notizen nur lokal (localStorage). Export über 📥 für Backup.
