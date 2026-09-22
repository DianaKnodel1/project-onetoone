# Landing-Generator vereinheitlichen + KI-Erstellung

## Ziel

1. **Ein Ablauf statt Vermittlung/Fast-Track:** Neue Landings zeigen immer direkt auf das eigene Portal — keine Weiterleitung zu einer anderen Firma mehr. Die verwirrende Auswahl entfällt.
2. **KI erstellt Landing-Pages — Texte, Design und Bilder:** Sie beschreiben die Seite, die KI erzeugt Aufbau, Texte, einen eigenen Design-Stil und auf Wunsch Bilder. Sie prüfen und bearbeiten alles im Editor — nichts geht ungesehen live.
3. **Eigene Vorlagen:** Gelungene Seiten speichern Sie per Häkchen als Vorlage und verwenden sie beim nächsten Mal wieder.

## Was die KI wirklich abnimmt (Ihre Frage)

| Aufgabe | Zeitersparnis |
|---|---|
| Texte (Überschrift, Stelle, Ablauf, FAQ, Kontakt) | **Groß** — statt 30–45 Min. pro Seite ein fertiger Entwurf in 1–2 Min. |
| Design (Farben, Schrift, Optik) | **Mittel** — nimmt die Entscheidung ab, aber meist 2–3× neu würfeln |
| Bilder (Stimmung, Hintergründe) | **Mittel** — gut für Atmosphäre, nicht für echte Team-/Arbeitsplatzfotos |
| Domain, Mandant, Impressum, Faktencheck | **Keine** — bleibt Ihre Arbeit, soll es auch |

Fazit: spürbare Erleichterung, aber kein Knopf, nach dem eine Seite fertig live geht.

## Wie weit darf die KI gehen?

| Ebene | Wer bestimmt | Warum |
|---|---|---|
| **Inhalt** — Überschriften, Texte, FAQ, Ablaufschritte | KI | Genau das soll sie schreiben |
| **Design** — Farbwelt, Schriftpaar, Rundungen, Abstände, hell/dunkel, Abschnitts-Optik | KI | Damit Seiten wirklich unterschiedlich aussehen |
| **Bilder** — Titelbild, Stimmungsbilder | KI auf Knopfdruck | Keine Stockfoto-Suche mehr nötig |
| **Funnel** — Bewerbungsformular, Terminbuchung, WhatsApp, Impressum | fest verdrahtet | Das ist Ihr Geschäft; hier darf nichts schiefgehen |

**Warum kein frei geschriebenes HTML?** Das Formular verlöre die Anbindung an Ihr Portal (Bewerbungen kämen nicht an), die Seite ließe sich nachher nicht mehr im Baukasten bearbeiten (nur noch im Code), und die Qualität schwankte von Seite zu Seite. Mit der Design-Ebene bekommen Sie den optischen Unterschied ohne diese Risiken.

## Womit arbeitet die KI?

Nichts Neues nötig. Ihr Portal hat bereits KI-Zugangsdaten unter **Admin → KI-Einstellungen** (apinet.cloud bzw. Google Gemini) — dieselben, die der Support-Chat und das Bewerbungsgespräch nutzen. Der Aufruf läuft serverseitig von Ihrem eigenen Server, der Schlüssel bleibt dort. Kein zusätzliches Konto, keine Abhängigkeit von Lovable im Livebetrieb. Fehlt ein Schlüssel, zeigt der Baukasten einen klaren Hinweis.

## Baustein 1 — Ablauf vereinheitlichen (nur neue Seiten)

- Neue Landings werden immer als Direkt-Bewerbung angelegt (`flow_type 'classic'`, keine Partner-Firma, keine Fast-Track-Verknüpfung).
- Generator-UI: Auswahl „Vermittlung/Fast" und Feld „Fast-Track-Verknüpfung" verschwinden beim Anlegen. In der Liste steht bei neuen Seiten „Direkt"; alte behalten ihren Vermerk.
- **Bestand bleibt unangetastet:** Die 11 Live-Landings laufen exakt weiter. Der Vermittlungs-Code bleibt erhalten, wird nur nicht mehr angeboten.

## Baustein 2 — Design-Ebene

- `branding` bekommt ein Stil-Paket: Grund-/Akzentfarbe, Textfarbe, Hintergrund, hell/dunkel, Schriftpaar, Eckenradius, Abstandsmaß.
- Jeder Abschnitt bekommt Optik-Varianten (zentriert · zweispaltig · Karten · Vollbild).
- Damit sehen zwei Seiten mit denselben Bausteinen deutlich unterschiedlich aus.

## Baustein 3 — KI-Assistent

- Knopf **„Mit KI erstellen"**.
- Dialog: Firmenname, Branche/Berufsfeld, Stelle (optional), Tonalität (seriös · modern · bodenständig · technisch), Design-Richtung (hell · dunkel · farbig · zurückhaltend), Besonderheiten als Freitext.
- Ergebnis: Abschnitts-Liste, alle Texte, Design-Paket — als Entwurf im Baukasten, voll bearbeitbar.
- **„Design neu würfeln":** gleiche Texte, neuer Stil.
- **Sicherheitsnetz:** unbekannte Bausteine werden verworfen; das Bewerbungsformular wird immer ergänzt; Farben werden auf Lesbarkeit geprüft; die KI darf nur Angaben aus Ihrer Beschreibung verwenden — keine erfundenen Zahlen, Auszeichnungen oder Kundenstimmen.

## Baustein 4 — KI-Bilder

- Neben jedem Bildfeld ein Knopf **„Mit KI erzeugen"** mit kurzer Beschreibung; das Bild landet in Ihrem vorhandenen Bildspeicher und wird direkt eingesetzt.
- Beim KI-Seitenentwurf optional „Bilder mit erzeugen" — Titelbild und Stimmungsbilder in einem Durchgang.
- Hinweis in der Oberfläche: für echte Team- oder Arbeitsplatzfotos eigene Bilder hochladen; KI-Bilder für Stimmung und Hintergründe.

## Baustein 5 — Eigene Vorlagen

- Beim Speichern: Häkchen **„Als Vorlage speichern"** + Name. Gespeichert werden Aufbau, Texte und Design-Stil.
- Beim Anlegen: **Leer starten · Mit KI erstellen · Aus eigener Vorlage**.
- Optional: „Texte auf neue Firma umschreiben" — Design der Vorlage bleibt, Texte werden angepasst.

## Was sich NICHT ändert

- Auslieferung (Renderer-Server, Domains, automatisches SSL, Sync) bleibt unverändert.
- Bestehende Live-Landings, Formular, Terminbuchung, WhatsApp bleiben wie sie sind.
- Baukasten bleibt Admin-only.

## Technische Details

- **Design-Ebene:** `landing_pages.branding` um ein `style`-Objekt erweitern; `renderSectionsLanding()` in `src/lib/landing-sections.ts` gibt die Werte als CSS-Variablen aus, Abschnitte bekommen eine `variant`-Eigenschaft. Danach `bun scripts/build-sections-renderer-js.mjs`.
- **KI-Text/Design:** Server-Funktion `generateLandingDraft` in `src/lib/landing-builder.functions.ts`; Zugangsdaten aus `system_settings` (apinet → Gemini-Fallback, Muster wie `src/routes/api/public/ai-chat.ts`). Antwort als JSON, validiert gegen `SECTION_CATALOG` + Style-Schema.
- **KI-Bilder:** Server-Funktion `generateLandingImage`; Gemini-Bildmodell über denselben Zugang, Ergebnis als PNG in den bestehenden Bucket `landing-media`, öffentliche URL zurück ins Bildfeld. Unterstützt der hinterlegte Schlüssel kein Bildmodell, wird der Knopf mit Hinweis ausgeblendet.
- **Vorlagen:** neue Tabelle `landing_templates` (Migration mit Grants + RLS, Admin-only).
- **UI:** `src/routes/admin.landing-baukasten.tsx` (KI-Dialog, Design-Felder, Bild-Knopf, Vorlagen), `src/routes/admin.landing-generator.tsx` (Flow-Auswahl entfernen).
- Prüfung `bunx tsgo --noEmit`; Deploy `git pull && bash scripts/deploy.sh`, danach `bash scripts/sync-landing-server.sh`.

## Reihenfolge

1. Ablauf-Vereinheitlichung
2. Design-Ebene im Renderer
3. KI-Assistent (Texte + Design)
4. KI-Bilder
5. Eigene Vorlagen
6. Deploy + gemeinsamer Live-Test einer KI-erstellten Seite
