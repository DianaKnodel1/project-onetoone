# Onboarding verpflichtend machen (nicht schließbar)

## Ziel

Nach der Registrierung öffnet sich das Onboarding. Es darf nicht mehr per Zurück-Pfeil, X oder Überspringen verlassen werden. Oben steht der Hinweis: **„Bitte nehmen Sie sich kurz Zeit für das Onboarding."** Erst nach vollständigem Durchlaufen (letzter Schritt → „Onboarding abschließen") geht es weiter. Keine anderen Funktionen oder Design-Änderungen.

## Änderungen

1. **`src/routes/_employee/onboarding.tsx`:**
   - Zurück-Pfeil in der Kopfzeile (navigiert aktuell zum Dashboard) entfernen.
   - Hinweiszeile oben einblenden: „Bitte nehmen Sie sich kurz Zeit für das Onboarding." (dezent, über dem Fortschrittsbalken).
   - Der „Zurück"-Knopf zwischen den Schritten bleibt (blättern innerhalb des Onboardings ist kein Verlassen).
   - Abgeschlossen-Ansicht und Fehleransicht bleiben unverändert.
2. **Absicherung gegen Umgehen:** In der Mitarbeiter-Ansicht (`src/routes/_employee/`-Layout bzw. Dashboard) prüfen: Ist `onboarding_status` nicht „abgeschlossen" (und Vertrag unterschrieben), wird auf `/onboarding` weitergeleitet. So bringt auch ein manueller Aufruf von `/dashboard` nichts. Nur diese Weiterleitung, keine weiteren Eingriffe.
3. **Bestehende Mitarbeiter nicht aussperren:** Wer `onboarding_status = "abgeschlossen"` hat, merkt nichts.

## Technische Details

- Nur Frontend-Änderungen, keine Datenbank-Migration.
- Statuswerte bleiben: `in_bearbeitung` beim ersten „Weiter", `abgeschlossen" am Ende.
- Deploy danach: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`.
