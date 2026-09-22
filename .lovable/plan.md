# Verifikation nach dem erfolgreichen Deploy

## Ausgangslage
- Deploy erfolgreich: Build grün, alle vier neuen Migrationen angewendet
  (`20260922000000_landing_sections`, `20260922010000_landing_media_bucket`,
  `20260922020000_sim_modul_und_sperre`, `20260922030000_sms_dedup_index_fix`).
- Damit existieren die Sperr-Spalten (`profiles.is_blocked` usw.) und die
  SMS-/Landing-Strukturen auf dem Backend. Der „Unbekannt“-Fix in der
  Mitarbeiterliste ist mit dem Deploy live.

## Schritt 1: Mitarbeiterliste prüfen (der eigentliche Fix)
- Admin-Portal neu laden (Strg+Umschalt+R, hartes Neuladen).
- Prüfungen, Termine und Mitarbeiter öffnen: Dort müssen jetzt echte Namen
  statt „Unbekannt“ stehen.
- Falls weiterhin „Unbekannt“ erscheint: Ich untersuche dann, welcher
  konkrete Query noch scheitert (Datenbankabfrage gegen api.mb-portal.com),
  und fixe gezielt nach.

## Schritt 2: SIM-Modul prüfen
- Admin → SIM-Modul öffnen: Zwei-Spalten-Ansicht, Nummer hinzufügen mit
  Anosim-Verbindungstest, Zuweisen/Entziehen an Mitarbeiter, Nachrichten mit
  Code-Hervorhebung, Auto-Refresh alle 15 Sekunden.
- Mitarbeiter-Seite (SMS): Nur Nachrichten ab Zuweisungszeitpunkt sichtbar.

## Schritt 3: Sperren/Freigeben prüfen
- Mitarbeiter sperren: rotes Badge, Name durchgestrichen im Chat.
- Gesperrter Login: neutrale Meldung „E-Mail oder Passwort ist falsch“,
  keine Registrierung mit gesperrter E-Mail.
- Freigeben: Login wieder möglich.

## Schritt 4: Landing-Baukasten prüfen
- Landing-Builder öffnen: Abschnitte, direkter Bild-Upload (max. 5 MB),
  „Text & Bild“-Abschnitt, Vorschau.
- Bestehende Live-Landings unverändert aufrufen.

## Hinweis
- „Landing-Server-Sync verzögert.“ im Deploy-Log betraf nur den Sync des
  Landing-Servers auf .152; die Core-Dateien wurden übertragen. Falls eine
  Landing-Änderung dort nicht sichtbar ist, nochmals
  `bash scripts/sync-landing-server.sh` auf dem Server ausführen.
