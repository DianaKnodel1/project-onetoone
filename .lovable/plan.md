# 15 Premium-Landing-Vorlagen auf Großunternehmens-Niveau

## Ziel

Hochprofessionelle, seriöse Landing-Seiten, die aussehen wie Webseiten großer Unternehmen. Die bisherigen Vorlagen und alten Themes werden entfernt, weil sie nicht gut aussehen.

## Warum der Baukasten heute fast gleiche Seiten baut

- Alle Design-Welten (Modern, Warm, Seriös, Express) nutzen dieselben 7 Bausteine, und jeder Baustein hat genau ein Aussehen.
- Die Welten ändern nur Farben, Schrift und Rundungen. Die KI schreibt nur die Texte.
- Deshalb entsteht immer dasselbe Gerüst in anderen Farben.

## Die Lösung: 15 fest designte Premium-Vorlagen

Jede Vorlage wird von Hand gestaltet, mit eigenem Aufbau, eigener Bildsprache, eigener Typografie und eigenen Farben. Kein Zufall, kein „alles gleich in anderen Farben“.

### Beispiele für die 15 Vorlagen

1. Beratungshaus (hell, viel Weißraum, klare Linien)
2. Tech-Konzern (dunkel, große Typografie, Akzentfarbe)
3. Logistik & Transport (kräftig, klare Fakten, große Bilder)
4. Pflege & Gesundheit (warm, menschlich, vertrauensvoll)
5. Magazin / Editorial (Zeitungs-Stil, elegante Serifen)
6. Luxus / Executive (dunkel, Gold-Akzente, ruhig)
7. Minimal / Schweizer Stil (strenges Raster, rote Akzente)
8. Handwerk & Bau (erdige Töne, robuste Optik)
9. Kanzlei / Finanzen (klassisch, dunkelblau, seriös)
10. Modernes Startup (frisch, große Abstände, weiche Formen)
11. Industrie & Technik (sachlich, grau/blau, strukturiert)
12. Service & Kundendienst (freundlich, hell, einladend)
13. Nordisch / Skandinavisch (hell, luftig, natürliche Farben)
14. Energie & Zukunft (grün/dunkel, modern, kraftvoll)
15. Klassisch Corporate (blau, traditionell, vertrauenswürdig)

### Was pro Vorlage und pro Seite änderbar bleibt

- Alle Texte und Überschriften
- Bilder (eigener Upload)
- Farben und Schriftart
- Firmenname, Kontaktdaten, Impressum
- Abschnitte ein-/ausblenden, verschieben, hinzufügen
- Geänderte Version als eigene Vorlage speichern

### Ablauf

1. Die 15 Vorlagen erscheinen im klassischen Generator unter „Vorlagen“ (wie die gespeicherten Vorlagen jetzt).
2. Du wählst eine Vorlage, änderst Texte, Bilder, Farben und Firmendaten.
3. Speichern erstellt eine neue Live-Seite oder eine eigene Vorlage.
4. Die KI kann optional die Texte passend zur Vorlage schreiben, ändert aber nie das Design.

## Was entfernt wird

- Die 27 alten Themes (theme-1 bis theme-27 und weitere) aus dem Generator
- Die 4 bisherigen Design-Welten (Modern, Warm, Seriös, Express) als Auswahl
- Bestehende Live-Seiten, die ein altes Theme nutzen, bleiben online und funktionieren weiter. Nur für neue Seiten stehen die alten Themes nicht mehr zur Verfügung.

## Was gleich bleibt

Bewerbungsformular, Datenschutz, Calendly-Terminbuchung, Weg ins Mitarbeiterportal, Domains und Server.

## Umsetzung in Etappen

1. Erste 5 Vorlagen bauen und gemeinsam prüfen
2. Feedback einarbeiten, dann Vorlagen 6–15
3. Alte Themes aus der Auswahl entfernen
4. KI-Texte passend zur gewählten Vorlage

## Technische Details

- Jede Vorlage ist eine fertige HTML/CSS-Seite im gleichen Format wie die bisherigen Themes (`template.html`, `style.css`, `meta.json` mit editierbaren Feldern), aber deutlich hochwertiger gestaltet.
- Die Vorlagen nutzen das bestehende Slot-System: Texte, Bilder und Farben sind als Felder im Generator editierbar.
- Alte Themes bleiben im Code für bestehende Live-Seiten, werden aber im Generator nicht mehr angezeigt.
- Der Live-Server (`landing-server`) rendert die neuen Vorlagen genau wie die alten, keine Server-Änderung nötig.
