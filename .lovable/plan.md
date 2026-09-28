# Landing-Seiten: Warum alles gleich aussieht – und welche Wege es gibt

Brainstorming – noch keine Umsetzung.

## Warum der Baukasten fast identische Seiten baut

- Alle vier Vorlagen (Modern, Warm, Seriös, Express) nutzen **dieselben 7 Abschnitts-Bausteine** mit **genau einem Layout pro Baustein** (Hero, Stelle, Text+Bild, Ablauf, FAQ, Kontakt, Formular).
- Die Vorlagen ändern nur Farben, Schrift, Eckenrundung und Abstände. Aufbau, Anordnung und Optik der Blöcke bleiben gleich.
- Die KI füllt nur Texte. Das Design kann sie nicht ändern.
- Ergebnis: dasselbe Gerüst, nur in anderen Farben. So wie jetzt gebaut, wird das nie „hochwertig und unterschiedlich“ aussehen.

## Option 1 – Fertige Premium-Webseiten (schnellster Weg zu Qualität)

Wir gestalten 8–12 komplette, hochwertige Firmenauftritte von Hand, jeder mit eigenem Layout, eigener Bildsprache und eigener Typografie (z. B. „Beratungshaus“, „Tech-Studio“, „Logistik“, „Pflege-Team“, „Editorial/Magazin“).
- Du wählst eine Seite aus und änderst Firmenname, Texte, Bilder, Farben und Kontakt. Das Formular und der Weg ins Portal sind fest eingebaut.
- Vorteil: garantiert professionell, jede Seite sieht wirklich anders aus.
- Nachteil: Der Aufbau bleibt pro Vorlage weitgehend fest.
- Das ist im Grunde der klassische Generator, nur neu und hochwertiger. Die bestehenden 27 Themes könnten wir dafür aussortieren und aufwerten.

## Option 2 – Baukasten mit echten Design-Varianten (flexibel und trotzdem schön)

Jeder Baustein bekommt 3–5 professionell gestaltete Varianten, zum Beispiel:
- Hero: Vollbild-Foto, geteilt, Magazin-Stil, große Typo, Video-Look
- Vorteile: Karten, Icon-Raster, Zahlen-Leiste, Zickzack
- Ablauf: Zeitstrahl, nummerierte Karten, horizontale Schritte
- Dazu neue Bausteine: Vorteile/Benefits, Team, Galerie, Standorte, Zitat-Banner, Zahlen/Fakten (nur mit echten Angaben)
- Jede „Design-Welt“ (Modern, Warm …) wählt automatisch andere Varianten. So entstehen wirklich verschiedene Seiten.
- Vorteil: bleibt flexibel und verwendet die heutige Technik weiter.
- Nachteil: mehr Arbeit (etwa 25–35 Varianten), Qualität hängt am Design jeder Variante.

## Option 3 – Kombination (Empfehlung)

- Aus den Bausteinen von Option 2 bauen wir 6–10 **fertige Premium-Seiten** (Option 1) als Startpunkte.
- Du wählst eine fertige Seite, änderst Texte, Bilder und Farben. Wer will, tauscht einzelne Blöcke gegen eine andere Variante.
- Die KI wählt beim Erstellen zufällig eine andere Premium-Seite und andere Varianten. Dadurch sehen auch KI-Seiten verschieden aus.
- Ein Weg für alles, gespeichert als Vorlagen, nutzbar im klassischen Generator (wie jetzt schon verbunden).

## Option 4 – Seite aus einer Vorbild-Webseite nachbauen

Du nennst eine Webseite, die dir gefällt. Wir bauen daraus einmalig eine eigene Vorlage im gleichen Stil (nicht kopiert, eigene Texte und Bilder). Das geht gut ergänzend zu Option 1 oder 3.

## Was in jedem Fall gleich bleibt

Bewerbungsformular, Datenschutz, Terminbuchung über Calendly, Weg ins Mitarbeiterportal, Domains und Server. Bestehende Live-Seiten bleiben unverändert.

## Offene Fragen an dich

1. Welche Richtung gefällt dir: fertige Seiten (1), flexible Varianten (2) oder die Kombination (3)?
2. Hast du 2–3 Beispiel-Webseiten, die dir optisch gefallen?
3. Wie viele unterschiedliche Firmenauftritte brauchst du etwa gleichzeitig (10, 30, 100)?
4. Eigene Fotos oder KI-/Stockbilder? Aktuell klappt die KI-Bilderzeugung nicht zuverlässig.

## Technische Details (für später)

- Varianten als `variant`-Feld je Abschnitt in `landing-sections.ts` und im Server-Renderer `sections-renderer.js` (beide synchron halten, Build-Skript `build-sections-renderer-js.mjs`).
- Premium-Seiten als Einträge in `landing_templates` (bestehende Tabelle), damit sie automatisch im klassischen Generator erscheinen.
- Blueprints bekommen feste Varianten-Kombinationen; die KI wählt Blueprint und Varianten, füllt nur Texte.
