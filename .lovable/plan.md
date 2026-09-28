# 15 hochwertige Landing-Vorlagen, alle anpassbar

## Warum der Baukasten heute fast gleiche Seiten baut

- Alle Design-Welten (Modern, Warm, Seriös, Express) nutzen dieselben 7 Bausteine, und jeder Baustein hat genau ein Aussehen.
- Die Welten ändern nur Farben, Schrift und Rundungen. Die KI schreibt nur die Texte.
- Deshalb entsteht immer dasselbe Gerüst in anderen Farben.

## Beste Lösung: 15 fertige Premium-Vorlagen mit Varianten-Bausteinen

Wir geben die Designs fest vor, damit sie professionell aussehen. Inhalte und einzelne Teile bleiben trotzdem änderbar.

1. **Neue Bausteine in mehreren Varianten.** Jeder Baustein bekommt 3–5 professionell gestaltete Varianten:
   - Kopfbereich: Vollbild-Foto, geteilt, Magazin, große Schrift, dunkel und elegant
   - Vorteile: Karten, Icon-Raster, Zickzack mit Bildern
   - Ablauf: Zeitstrahl, nummerierte Karten, horizontale Schritte
   - Stelle, FAQ, Kontakt, Formular-Rahmen: je 2–3 Varianten
   - Neue Bausteine: Vorteile, Team/Ansprechpartner, Bildergalerie, Zitat-Banner, Standort, Fakten (nur mit echten Angaben)
2. **15 fertige Vorlagen** aus diesen Bausteinen, jede mit eigener Kombination, Farbwelt, Schrift und Bildsprache. Beispiele: Beratungshaus, Tech-Studio, Logistik, Pflege-Team, Magazin, Luxus-Dunkel, Minimal-Schweiz, Handwerk, Kanzlei-Stil, Startup, Finanz, Service-Center, Nordisch-Hell, Klassisch-Blau, Energie.
3. **Frei änderbar pro Vorlage und pro Seite:**
   - alle Texte, Bilder (Upload), Farben, Schrift, Firmendaten
   - Abschnitte ein- und ausblenden, verschieben, hinzufügen
   - pro Abschnitt eine andere Variante wählen (Beispiel: Kopfbereich „geteilt“ statt „Vollbild“)
   - geänderte Vorlage als neue eigene Vorlage speichern oder die Vorlage selbst aktualisieren
4. **Ein Ablauf:** Die 15 Vorlagen erscheinen im klassischen Generator unter „Vorlagen“ (wie die gespeicherten Vorlagen jetzt). Bearbeitet werden sie im Baukasten.
5. **KI optional:** Die KI füllt Texte passend zur gewählten Vorlage. Das Design ändert sie nicht, damit die Qualität gleich bleibt.

## Warum das die beste Lösung ist

- Das Design kommt von Hand: seriös und hochwertig, nicht zufällig.
- 15 Vorlagen mit Varianten und Farben ergeben sehr viele sichtbar unterschiedliche Firmenauftritte.
- Alles bleibt dauerhaft änderbar, ohne dass eine Seite „kaputt“ gebaut werden kann.

## Was gleich bleibt

Bewerbungsformular, Datenschutz, Calendly, Weg ins Mitarbeiterportal, Domains und Server. Bestehende Live-Seiten und alte Themes bleiben unverändert.

## Umsetzung in Etappen

1. Varianten-System und neue Bausteine (Kopfbereich, Vorteile, Ablauf zuerst)
2. Vorlagen 1–5 fertig bauen, dann gemeinsam prüfen und Feedback geben
3. Vorlagen 6–15
4. Varianten-Auswahl im Baukasten, KI-Texte passend zur Vorlage

## Technische Details

- `variant`-Feld je Abschnitt in `src/lib/landing-sections.ts`, danach Mirror neu erzeugen (`bun scripts/build-sections-renderer-js.mjs`) für den Live-Server.
- Die 15 Vorlagen als fest im Code definierte System-Vorlagen (wie die Blueprints) mit Abschnitten, Varianten und Stil. Sie werden zusammen mit den `landing_templates` im Generator gelistet. Eine Änderung speichert eine Kopie in `landing_templates`.
- Baukasten-Editor: Varianten-Auswahl je Abschnitt als einfaches Auswahlfeld in der bestehenden Abschnitts-Bearbeitung.
- Bilder: Upload wie bisher, zusätzlich passende Standardbilder je Vorlage.
