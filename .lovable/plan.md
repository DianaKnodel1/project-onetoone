# Landing-Generator vereinheitlichen + KI-Erstellung

## Ziel

1. **Ein Flow statt Vermittlung/Fast-Track:** Neue Landings zeigen immer direkt auf das eigene Portal — keine Weiterleitung zu einer anderen Firma mehr. Die verwirrende Flow-Auswahl entfällt im Generator.
2. **KI erstellt Landing-Pages:** Im Baukasten beschreiben Sie die Seite (Firma, Branche, Stelle, Tonalität), die KI füllt die vorhandenen Bausteine mit Texten. Sie prüfen und bearbeiten das Ergebnis wie gewohnt im Editor — nichts geht ungesehen live.
3. **Eigene Vorlagen:** Gelungene Seiten speichern Sie per Häkchen als Vorlage und verwenden sie beim nächsten Mal wieder.

## Empfehlung zum KI-Umfang (Ihre Rückfrage)

**Texte + Abschnitte + Farbvorschlag.** Begründung: Die KI darf nur die vorhandenen Bausteine (Hero, Stelle, Ablauf, FAQ, Logos, Kontakt, Freitext, Bild, Text&Bild, Bewerbungsformular) mit Inhalten füllen und Farben vorschlagen — Layout-Typen, Reihenfolge-Logik und Funnel-Elemente (Formular, Termin, WhatsApp) bleiben fest verdrahtet. Farben sind im Baukasten nur Felder, die Sie mit einem Klick ändern. „Komplett frei" wäre riskant (Qualität schwankt, Funnel könnte leiden) und bringt gegenüber der Baustein-Füllung kaum Mehrwert.

## Baustein 1 — Flow vereinheitlichen (nur neue Seiten)

- Neue Landings werden immer als **Direkt-Bewerbung** angelegt (technisch: `flow_type 'classic'`, kein `partner_company_id`, kein `linked_fasttrack_landing_id`).
- Generator-UI: Die Flow-Auswahl (Vermittlung/Fast) und das Feld „Fast-Track-Verknüpfung" werden beim Anlegen neuer Seiten entfernt. Die Spalte „Flow" in der Landings-Tabelle zeigt den Vermerk nur noch bei den alten Bestands-Seiten; neue zeigen „Direkt".
- **Bestand bleibt unangetastet:** Die 11 vorhandenen Live-Landings laufen exakt wie bisher weiter (Ihre Entscheidung). Der Vermittlungs-Code bleibt im Hintergrund erhalten, wird aber nicht mehr angeboten.
- Zwischenseite `/bewerbung/verbinden` und Partner-Firmen-Verwaltung bleiben für den Bestand funktionsfähig.

## Baustein 2 — KI-Assistent im Baukasten

- Neuer Knopf **„Mit KI erstellen"** im Landing-Baukasten.
- Dialog mit wenigen Feldern: Firmenname, Branche/Berufsfeld, konkrete Stelle (optional), Tonalität (seriös/modern/bodenständig), Farbwunsch (optional), Besonderheiten (Freitext, z. B. „Einstieg ab sofort, kein Lebenslauf nötig").
- Die KI liefert eine Abschnitts-Liste (nur bekannte Baustein-Typen) inkl. aller Texte und einem Farbvorschlag.
- **Sicherheitsnetz:** Unbekannte Bausteine/Felder werden verworfen; das Bewerbungsformular wird immer ergänzt, falls die KI es weglässt; keine erfundenen Versprechen — die KI wird angewiesen, nur Angaben aus Ihrer Beschreibung zu verwenden.
- Das Ergebnis öffnet sich als normaler Entwurf im Baukasten: Sie bearbeiten Texte, tauschen Bilder, sortieren Abschnitte — erst „Speichern & live schalten" veröffentlicht.

## Baustein 3 — Eigene Vorlagen

- Beim Speichern einer Baukasten-Seite: Häkchen **„Als Vorlage speichern"** + Name.
- Beim Anlegen einer neuen Seite Auswahl: **Leer starten · Mit KI erstellen · Aus eigener Vorlage** (Ihre gespeicherten Seiten-Layouts).
- Vorlagen speichern Aufbau, Texte und Farben — beim Verwenden ändern Sie nur Firma/Stelle, oder lassen die KI die Texte der Vorlage auf die neue Firma umschreiben (kleiner Zusatz-Dialog, optional in Schritt 2).

## Was sich NICHT ändert

- Auslieferung (Renderer-Server, Domains, automatisches SSL, Sync) bleibt unverändert.
- Bestehende Live-Landings, Formular, Terminbuchung, WhatsApp — alles bleibt wie es ist.
- Baukasten bleibt Admin-only.

## Technische Details

- KI-Aufruf: neue Server-Funktion `generateLandingSections` in `src/lib/landing-builder.functions.ts`; Zugangsdaten kommen aus den bestehenden **Admin → KI-Einstellungen** (gleiches Muster wie der KI-Chat — kein neuer Schlüssel nötig). Antwort als striktes JSON, validiert gegen `SECTION_CATALOG` in `src/lib/landing-sections.ts`.
- Neue Tabelle `landing_templates` (Migration mit Grants + RLS, Admin-only) für eigene Vorlagen.
- UI: `src/routes/admin.landing-baukasten.tsx` (KI-Dialog, Vorlagen-Auswahl, Häkchen) und Generator-Liste `admin.landing-generator.tsx` (Flow-Spalte vereinfachen, Auswahl beim Anlegen entfernen).
- Prüfung: `bunx tsgo --noEmit`; danach `git push` und auf dem Server `git pull && bash scripts/deploy.sh` (Migration läuft mit).

## Reihenfolge

1. Flow-Vereinheitlichung (klein, entwirrt den Generator sofort)
2. KI-Assistent
3. Eigene Vorlagen
4. Deploy + gemeinsamer Live-Test einer KI-erstellten Seite
