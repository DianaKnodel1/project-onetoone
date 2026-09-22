# Landing-Generator: Optionen zur Überarbeitung

Brainstorming-Dokument — keine Umsetzung. Ziel: Landing-Pages sollen flexibler editierbar und direkt erstellbar sein.

## Ausgangslage (Ist-Zustand)

- 27 feste Themes (`src/landing-themes/theme-*`), je `template.html` + `style.css` + `script.js` + `meta.json` (~6.200 Zeilen Templates).
- Editierbar nur: Branding-Felder + pro Theme deklarierte „Slots" (Text/Bild/Farbe). Layout, Reihenfolge, Anzahl der Abschnitte sind fest.
- Auslieferung: separater Renderer-Server pro Domain, rendert aus der DB-Tabelle `landing_pages` (branding + slots als JSON).
- Admin: ein großes Formular mit Theme-Auswahl + Slot-Feldern.

## Option A — Abschnitts-Baukasten (Sections statt Themes)

Eine Seite wird aus wählbaren Abschnitten zusammengesetzt: Hero, Stellenanzeige, Ablauf, FAQ, Bewerbungsformular, Partner-Logos, Impressum …

- Admin: Abschnitt hinzufügen / entfernen / per Drag & Drop sortieren; jeder Abschnitt hat eigene Felder (Texte, Bilder, Farben).
- Speicherung: Abschnitt-Liste als JSON in der DB (statt festem theme_id).
- Renderer liest die Abschnitt-Liste und baut die Seite daraus — die Infrastruktur (Renderer-Server, Domain, Sync) bleibt unverändert.
- Vorteile: volle Kontrolle über Aufbau, vorhersagbar, seriös, alle bestehenden Funnel-Elemente (Formular, Calendly, WhatsApp) bleiben garantiert intakt.
- Aufwand: mittel — bestehende Themes werden nach und nach in Abschnitte zerlegt; kein komplettes Neuschreiben nötig.

## Option B — Visueller Editor mit Live-Vorschau

Wie Option A, aber mit echtem „Klicken & Tippen": Text direkt in der Vorschau bearbeiten, Farben per Farbwähler, Abschnitte per Maus verschieben — sofort sichtbar.

- Baut technisch auf Option A auf (gleiche Datenstruktur), nur die Oberfläche ist visuell statt Formular.
- Vorteile: sehr schnelles Arbeiten, man sieht sofort das Ergebnis.
- Aufwand: höher (Editor-UI), sinnvoll als Schritt 2 nach A.

## Option C — KI-generierte Seiten

Du beschreibst die Seite („Personalservice, Lagerhelfer, blau, seriös"), eine KI baut Texte und Aufbau, du feilst danach nach.

- Vorteile: neue Seite in Minuten, keine leeren Textfelder mehr.
- Risiken: Texte müssen geprüft werden (seriös, keine erfundenen Versprechen); Design-Qualität schwankt; Funnel-Elemente (Formular, Termin, WhatsApp) müssen fest verdrahtet bleiben, KI füllt nur Inhalte.
- Gut kombinierbar mit A: KI erzeugt die Abschnitt-Liste + Texte, du bearbeitest sie im Baukasten weiter.

## Option D — Fertige Vorlagen-Galerie (Mini-Variante)

Statt 27 festen Themes: 5–8 kuratierte Vorlagen, bei denen Aufbau, Texte und Farben frei änderbar sind (also A „light", ohne Drag & Drop).

- Geringster Aufwand, behält aber das „fest"-Gefühl teilweise bei.

## Empfehlung zum Weiterdenken

- Schritt 1: **Option A** (Baukasten) — löst das Kernproblem „fest, nicht änderbar".
- Schritt 2: **Option C** als Erstellungs-Assistent — löst „direkt erstellen" (schnell von null zu einer fertigen Seite).
- Schritt 3: **Option B** (visueller Editor) nur, wenn A im Alltag noch zu umständlich ist.
- Die Auslieferung (Renderer-Server, Domains, Sync, Formular, Calendly, WhatsApp) bleibt in allen Optionen unangetastet.

## Offene Fragen

1. Sollen bestehende Live-Landings weiterlaufen und nur neue Seiten im Baukasten entstehen, oder alle migrieren?
2. Wie viele verschiedene Abschnitts-Typen braucht ihr realistisch (Start: ~10)?
3. Wer bedient den Baukasten — nur du/Admins oder auch Mandanten?

## Technische Details (bei Umsetzung, nicht jetzt)

- Neue DB-Spalte/Tabelle für Abschnitt-Listen (JSON), `theme_id` bleibt für Bestand erhalten.
- `applyPlaceholders()`-Engine wird pro Abschnitt wiederverwendet.
- Admin-Route `admin.landing-generator.tsx` (heute 1845 Zeilen) wird durch Baukasten-Editor ersetzt.
- Bestehende Einschränkungen gelten weiter: keine eigenen E-Mails, WhatsApp manuell, kein Social Proof ohne echte Daten.
