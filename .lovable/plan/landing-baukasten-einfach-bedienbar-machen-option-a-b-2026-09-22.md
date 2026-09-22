# Landing-Baukasten: einfach bedienbar machen (Option A + B)

## Was „Abschnittstypen" bedeutet

Eine Seite besteht aus Bausteinen, die untereinander stehen. Jeder Baustein ist ein „Abschnittstyp" mit eigenen Eingabefeldern. Vorhanden sind heute zehn:

- Titelbereich (Kicker, Überschrift, Untertitel, Knopf, Bild)
- Stellenanzeige (Titel, Ort, Gehalt, Aufgaben, Anforderungen)
- Ablauf („So geht's", Schritte)
- FAQ (Fragen und Antworten)
- Partner-Logos
- Ansprechpartner & Kontakt (WhatsApp/Telefon/E-Mail)
- Freitext
- Bild
- Bewerbungsformular & Termin (nur einmal pro Seite)
- Zwischen-Text

Du baust eine Seite, indem du diese Bausteine hinzufügst, in die gewünschte Reihenfolge bringst und ausfüllst. Das ist Option A — sie ist bereits gebaut.

## Antwort auf die Frage

Ja, A + B zusammen ist sinnvoll. A liefert die Struktur (was es überhaupt an Bausteinen gibt), B macht die Bedienung angenehm: direkt in der Vorschau arbeiten statt in einer Formularliste daneben. Ohne A hätte B nichts zu bearbeiten, deshalb bleibt A die Basis und B kommt obendrauf.

## Was gebaut wird (Option B auf A)

1. **Direkt in der Vorschau bearbeiten:** Fährst du in der Vorschau über einen Abschnitt, erscheint ein Rahmen mit „Bearbeiten", „Nach oben", „Nach unten", „Löschen". Klick auf „Bearbeiten" öffnet die Felder genau dieses Abschnitts rechts daneben — kein Suchen mehr in einer langen Liste.
2. **Abschnitt per Ziehen verschieben:** Reihenfolge per Maus ändern, statt Pfeiltasten zu klicken.
3. **Einfügen an der richtigen Stelle:** Zwischen zwei Abschnitten erscheint ein „+"-Knopf. Danach wählst du den Typ aus einer bebilderten Auswahl mit kurzer Erklärung („Titelbereich — der große Kopf der Seite").
4. **Neue Seite von Grund auf:** Knopf „Neue Seite". Du wählst einen Startpunkt: leere Seite oder Vorlage (z. B. „Klassische Bewerberseite": Titel, Stelle, Ablauf, FAQ, Formular). Danach frei änderbar.
5. **Sicheres Speichern:** „Speichern" mit Hinweis auf ungespeicherte Änderungen, plus „Verwerfen". Vorschau aktualisiert sich automatisch kurz nach dem Tippen.
6. **Ansicht Handy/Desktop:** Umschalter über der Vorschau.

## Was ausdrücklich unangetastet bleibt

- Bestehende Live-Landings laufen unverändert weiter. Sie ändern sich erst, wenn du sie im Baukasten lädst und speicherst.
- Auslieferung (Renderer-Server, Domains, Sync, Formular, Calendly, WhatsApp) bleibt wie sie ist.
- Der klassische Generator bleibt nutzbar.
- Nur Admins haben Zugriff.
- Kein Social Proof, keine Zähler, keine eigenen E-Mails.

## Technische Umsetzung

- `src/lib/landing-sections.ts`: Renderer bekommt einen optionalen Editor-Modus, der jedem Abschnitt `data-section-id` und `data-section-index` ins HTML schreibt (nur in der Vorschau, nie in der ausgelieferten Seite). Katalog um Kurzbeschreibung je Typ ergänzt; Vorlagen (`SECTION_TEMPLATES`) als benannte Abschnitts-Listen.
- `src/routes/admin.landing-baukasten.tsx`: Zwei-Spalten-Layout (Vorschau links, Felder rechts). Vorschau-iframe kommuniziert per `postMessage` (Klick auf Abschnitt → Auswahl in der Eltern-Seite). Overlay-Leiste und „+"-Zonen werden per injiziertem Skript in der Vorschau eingeblendet. Drag & Drop über die vorhandene Bibliothek, sonst HTML5-Drag. Debounce (~400 ms) für die Neu-Vorschau. Dirty-State mit Warnung beim Verlassen.
- `src/lib/landing-builder.functions.ts`: `renderSectionsPreview` bekommt Flag `editor: boolean`; Admin-Prüfung bleibt.
- Neue Seite: `saveLandingPage` wird mit neuem Slug aufgerufen; Slug-Validierung und Hinweis bei Dopplung.
- `scripts/build-sections-renderer-js.mjs` erneut ausführen, damit `landing-server/sections-renderer.js` synchron bleibt.
- Prüfungen: `bunx tsgo --noEmit`, `node --check landing-server/sections-renderer.js`.

## Weiterhin offen (Server, nicht Teil dieses Schritts)

Migration `20260922000000_landing_sections.sql` einspielen, `git pull && bash scripts/deploy.sh`, `bash scripts/sync-landing-server.sh`.
