# Vorhandene Landing-Vorlagen aufwerten: seriöser, professioneller, alle „direkt"

## Ziel

Die vorhandenen Landing-Vorlagen bleiben erhalten, werden aber grundlegend verbessert, damit sie seriös und hochprofessionell aussehen (Niveau großer Unternehmen). Zusätzlich wird die Unterscheidung „Fast-Track / Vermittlung" entfernt – alle Vorlagen sind ab jetzt „direkt".

## Teil 1 – Alle Vorlagen werden „direkt"

- Es gibt keinen Unterschied mehr zwischen Fast-Track und Vermittlung. Jede Vorlage führt direkt zum Bewerbungsformular, dann Calendly-Termin, dann Mitarbeiterportal.
- Die Auswahl „Fast-Track / Vermittlung" im Generator entfällt. Bestehende Seiten laufen unverändert weiter.
- Technisch: Portal-Theme-Auswahl und Fast-Track-Optionen im Generator entfernen bzw. vereinheitlichen; der Bewerberweg ist für alle Seiten derselbe.

## Teil 2 – Vorlagen optisch aufwerten

Jede vorhandene Vorlage wird einzeln durchgegangen und verbessert. Typische Schwächen, die wir beheben:

- **Typografie:** bessere Schriftarten, klare Größen-Hierarchie, saubere Zeilenabstände
- **Abstände & Raster:** gleichmäßige, großzügige Abstände statt zusammengequetschter Abschnitte
- **Farben:** ruhigere, edlere Farbwelten mit gutem Kontrast statt greller Standardfarben
- **Kopfbereich:** hochwertiger Einstieg mit großem Bild, klarer Überschrift, einem klaren Button
- **Buttons & Formulare:** einheitliche, hochwertige Gestaltung
- **Bilder:** passende, hochwertige Standardbilder pro Vorlage statt leerer Platzhalter
- **Mobil:** jede Vorlage wird auf dem Handy geprüft und sauber gemacht
- **Details:** Schatten, Rundungen, Linien, Icons – das Kleine, das „professionell" ausmacht

## Vorgehen

1. **Stichprobe zuerst:** Wir werten 2–3 Vorlagen komplett auf, du schaust sie dir an und gibst Feedback zum Stil.
2. **Dann der Rest:** Mit dem abgestimmten Stil werten wir alle weiteren Vorlagen auf.
3. **Aussortieren erlaubt:** Vorlagen, die auch nach der Aufwertung nicht überzeugen, blenden wir im Generator aus (Bestands-Seiten bleiben online).

## Was gleich bleibt

- Alle bestehenden Live-Seiten funktionieren unverändert weiter.
- Bewerbungsformular, Datenschutz, Calendly, Weg ins Mitarbeiterportal, Domains und Server bleiben unangetastet.
- Alle Texte, Bilder und Farben bleiben pro Seite im Generator änderbar.

## Technische Details

- Aufwertung direkt in den Theme-Dateien (`src/landing-themes/theme-*/template.html`, `style.css`, `meta.json`).
- Fast-Track/Vermittlung-Logik in `admin.landing-generator.tsx` und den Speicher-Funktionen vereinheitlichen.
- Nach jeder Theme-Änderung: `bun scripts/build-theme-assets.mjs`, damit der Live-Server die neuen Dateien bekommt.
- Deploy wie immer: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`.
