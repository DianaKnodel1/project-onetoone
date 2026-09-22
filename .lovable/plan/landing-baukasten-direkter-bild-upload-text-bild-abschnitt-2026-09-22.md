# Landing-Baukasten: Direkter Bild-Upload + „Text & Bild"-Abschnitt

## Ziel

1. **Bilder direkt hochladen**: In jedem Bild-Feld des Baukastens Datei auswählen statt URL einfügen. Das Bild erscheint sofort in der Vorschau.
2. **Neuer Abschnitt „Text & Bild"**: Text und Bild nebeneinander, Bild wahlweise links oder rechts — deckt die häufigsten Layout-Wünsche ab, ohne freies Ziehen von Textblöcken (das würde auf dem Handy brechen; Abschnitte lassen sich bereits per Drag & Drop anordnen).

## Aktueller Stand (geprüft)

- Bild-Felder (Hero, Bild-Abschnitt, Partner-Logos) erwarten eine manuell eingefügte URL.
- Der Hilfe-Text verweist auf „Admin → Uploads" — diese Seite zeigt aber nur Mitarbeiter-Dateien, dort kann man keine Landing-Bilder hochladen. Der Verweis ist falsch.
- Der Renderer akzeptiert nur `https://…`-URLs und `/assets/…`-Pfade.
- Upload-Ziel: Storage-Bucket des eigenen Supabase (api.mb-portal.com). Upload läuft direkt aus dem Browser über den bestehenden Supabase-Client; der Landing-Server bleibt unberührt, weil die Bilder per https-URL geladen werden.

## Umsetzung

### 1. Storage-Bucket „landing-media" (Migration)

Neue manuelle Migration `supabase/manual-migrations/` (wie üblich auf dem Server einspielen):

- Bucket `landing-media` anlegen (public, Bilder max. 5 MB).
- Policies: Öffentlich lesbar (anon SELECT); Schreiben/Löschen nur für Authentifizierte mit `profiles.role in ('admin','super_admin')` (gleiche Prüfung wie im Baukasten).
- GRANTs analog zu bestehenden Migrations-Mustern.

### 2. Bild-Felder mit Upload ausstatten (admin.landing-baukasten.tsx)

- `FieldEditor` (kind „image"): Datei-Auswahl-Knopf + Vorschau-Bildchen; Upload per `supabase.storage.from('landing-media')`; nach Abschluss steht die öffentliche URL im Feld. URL-Feld bleibt als Fallback sichtbar (z. B. für bereits gehostete Bilder). Knopf „Entfernen".
- `ObjectsField` (Partner-Logos): gleiche Upload-Möglichkeit pro Logo-Eintrag.
- Falschen Hilfe-Text korrigieren (Upload passiert jetzt direkt im Feld).
- Fehlerfall (keine Admin-Rechte, zu große Datei) als verständliche Meldung.

### 3. Neuer Abschnittstyp „textbild"

In `src/lib/landing-sections.ts`:

- Katalog-Eintrag „Text & Bild" mit Feldern: Überschrift, Text, Bild (kind image), Bildposition (links/rechts), optionale Knopf-Zeile (Text + Ziel). Defaults mit Beispieltext.
- Renderer: Zweispaltiges Grid (Text + Bild) wie im Hero, auf dem Handy untereinander; Bildposition via CSS-Klasse `order`.
- In `defaultSections()` und ggf. Vorlage „klassisch" aufnehmen.

### 4. Renderer-Mirror neu bauen + Prüfungen

- `bun scripts/build-sections-renderer-js.mjs`, `node --check landing-server/sections-renderer.js`.
- `bunx tsgo --noEmit` grün.
- Vorschau im Admin per Playwright prüfen: Upload-Feld erscheint, neuer Abschnitt rendert, Live-Vorschau aktualisiert sich.
- `roadmap.md` ergänzen.

## Für dich zum Livegehen (wie gehabt, auf deinem Server)

1. Migration einspielen (legt den Bild-Speicher an — ohne das schlägt der Upload fehl).
2. `git pull && bash scripts/deploy.sh`
3. `bash scripts/sync-landing-server.sh` (schiebt auch den neuen Renderer).
