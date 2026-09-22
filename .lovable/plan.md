# Landing-Generator vereinheitlichen + KI-Erstellung

## Ziel

1. **Ein Ablauf statt Vermittlung/Fast-Track:** Neue Landings zeigen immer direkt auf das eigene Portal — keine Weiterleitung zu einer anderen Firma mehr. Die verwirrende Auswahl entfällt.
2. **KI erstellt Landing-Pages — inklusive Design:** Sie beschreiben die Seite, die KI erzeugt Aufbau, Texte **und einen eigenen Design-Stil** (Farben, Schriften, Optik). Sie prüfen und bearbeiten alles im Editor — nichts geht ungesehen live.
3. **Eigene Vorlagen:** Gelungene Seiten speichern Sie per Häkchen als Vorlage und verwenden sie beim nächsten Mal wieder.

## Wie weit darf die KI gehen? (Ihre Frage)

Drei Ebenen — die KI bekommt Ebene 1 und 2 komplett, Ebene 3 bleibt fest:

| Ebene | Wer bestimmt | Warum |
|---|---|---|
| **Inhalt** — Überschriften, Texte, FAQ, Ablaufschritte | KI | Genau das soll sie schreiben |
| **Design** — Farbwelt, Schriftpaar, Rundungen, Abstände, hell/dunkel, Abschnitts-Optik (zentriert/zweispaltig/Karten/Vollbild) | KI | Damit Seiten wirklich unterschiedlich aussehen |
| **Funnel** — Bewerbungsformular, Terminbuchung, WhatsApp, Impressum/Datenschutz | fest verdrahtet | Das ist Ihr Geschäft; hier darf nichts schiefgehen |

**Warum nicht „KI schreibt freies HTML"?** Drei konkrete Nachteile: das Formular verliert die Anbindung an Ihr Portal (Bewerbungen kämen nicht an), die fertige Seite ließe sich nachher nicht mehr im Baukasten bearbeiten (nur noch im Code), und die Qualität schwankt von Seite zu Seite. Mit der Design-Ebene bekommen Sie den optischen Unterschied, ohne diese drei Risiken.

## Womit arbeitet die KI? (Ihre Frage)

Nichts Neues nötig. Ihr Portal hat bereits KI-Zugangsdaten unter **Admin → KI-Einstellungen** (apinet.cloud bzw. Google Gemini) — dieselben, die der Support-Chat und das Bewerbungsgespräch nutzen. Der Aufruf läuft serverseitig von Ihrem eigenen Server aus, der Schlüssel bleibt dort. Kein zusätzliches Konto, keine Abhängigkeit von Lovable im Livebetrieb. Ist kein Schlüssel hinterlegt, zeigt der Baukasten einen klaren Hinweis statt einer Fehlermeldung.

## Baustein 1 — Ablauf vereinheitlichen (nur neue Seiten)

- Neue Landings werden immer als Direkt-Bewerbung angelegt (`flow_type 'classic'`, keine Partner-Firma, keine Fast-Track-Verknüpfung).
- Generator-UI: Auswahl „Vermittlung/Fast" und Feld „Fast-Track-Verknüpfung" verschwinden beim Anlegen. In der Liste steht bei neuen Seiten „Direkt"; alte behalten ihren Vermerk.
- **Bestand bleibt unangetastet:** Die 11 Live-Landings laufen exakt weiter. Der Vermittlungs-Code bleibt erhalten, wird nur nicht mehr angeboten.

## Baustein 2 — KI-Assistent im Baukasten

- Knopf **„Mit KI erstellen"**.
- Dialog: Firmenname, Branche/Berufsfeld, Stelle (optional), Tonalität (seriös · modern · bodenständig · technisch), Design-Richtung (hell · dunkel · farbig · zurückhaltend), Besonderheiten als Freitext.
- Die KI liefert: Abschnitts-Liste (nur bekannte Bausteine), alle Texte, sowie ein Design-Paket — Grund- und Akzentfarbe, Textfarbe, Hintergrund, Schriftpaar, Eckenradius, Abstandsmaß, pro Abschnitt eine Optik-Variante.
- **Sicherheitsnetz:** unbekannte Bausteine/Felder werden verworfen; das Bewerbungsformular wird immer ergänzt; Farben werden auf Lesbarkeit (Kontrast) geprüft und notfalls korrigiert; die KI darf nur Angaben aus Ihrer Beschreibung verwenden — keine erfundenen Zahlen, Auszeichnungen oder Kundenstimmen.
- Ergebnis öffnet sich als Entwurf im Baukasten: Texte ändern, Bilder tauschen, Abschnitte sortieren, Farben nachjustieren. Erst „Speichern & live schalten" veröffentlicht.
- Zusätzlich „Design neu würfeln": gleiche Texte, neuer Stil — für schnelles Durchprobieren.

## Baustein 3 — Eigene Vorlagen

- Beim Speichern: Häkchen **„Als Vorlage speichern"** + Name. Gespeichert werden Aufbau, Texte und Design-Stil.
- Beim Anlegen einer neuen Seite: **Leer starten · Mit KI erstellen · Aus eigener Vorlage**.
- Optional bei Vorlagen-Nutzung: „Texte auf neue Firma umschreiben" — die KI passt die Vorlagentexte an, das Design bleibt.

## Was sich NICHT ändert

- Auslieferung (Renderer-Server, Domains, automatisches SSL, Sync) bleibt unverändert.
- Bestehende Live-Landings, Formular, Terminbuchung, WhatsApp bleiben wie sie sind.
- Baukasten bleibt Admin-only.

## Technische Details

- **Design-Ebene neu:** `landing_pages.branding` wird um ein `style`-Objekt erweitert (Farben, Schriftpaar, Radius, Spacing, Modus). `renderSectionsLanding()` in `src/lib/landing-sections.ts` gibt diese Werte als CSS-Variablen aus; jeder Abschnitt bekommt Optik-Varianten über eine `variant`-Eigenschaft. Danach `bun scripts/build-sections-renderer-js.mjs`, damit der Live-Renderer mitzieht.
- **KI-Aufruf:** neue Server-Funktion `generateLandingDraft` in `src/lib/landing-builder.functions.ts`; Zugangsdaten über `system_settings` (apinet → Gemini-Fallback, gleiches Muster wie `src/routes/api/public/ai-chat.ts`). Antwort als JSON, validiert gegen `SECTION_CATALOG` und eine Style-Schema-Prüfung; unbekannte Felder fallen raus.
- **Vorlagen:** neue Tabelle `landing_templates` (Migration mit Grants + RLS, Admin-only).
- **UI:** `src/routes/admin.landing-baukasten.tsx` (KI-Dialog, Design-Felder, Vorlagen), `src/routes/admin.landing-generator.tsx` (Flow-Auswahl entfernen, Liste vereinfachen).
- Prüfung `bunx tsgo --noEmit`; Deploy `git pull && bash scripts/deploy.sh`, danach `bash scripts/sync-landing-server.sh`.

## Reihenfolge

1. Ablauf-Vereinheitlichung (klein, entwirrt den Generator sofort)
2. Design-Ebene im Renderer
3. KI-Assistent
4. Eigene Vorlagen
5. Deploy + gemeinsamer Live-Test einer KI-erstellten Seite
