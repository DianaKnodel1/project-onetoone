# Registrierung ohne Mail – Abschluss und Kontrolle

## Stand
- Portal-Update erfolgreich eingespielt.
- Alle 4 Anmelde-/Mail-Funktionen erfolgreich auf dem Datenbank-Server eingespielt und neu gestartet.
- Der Fix ist damit live. Code-Änderungen sind nicht mehr nötig.

## Nächste Schritte (durch Sie)
1. Selbst testen: Auf einer Generator-Seite mit einer neuen Test-E-Mail registrieren. Erwartet: „Dein Account ist angelegt“, danach Login möglich.
2. Die 3 betroffenen Bewerber bitten, sich noch einmal zu registrieren.
3. Hinweis: „Landing-Server-Sync verzögert“ ist wie beim letzten Mal harmlos.

## Nur falls es trotzdem hakt
- Screenshot der Fehlermeldung schicken.
- Optional auf dem Datenbank-Server prüfen:
  `docker logs supabase-edge-functions --tail 50`
