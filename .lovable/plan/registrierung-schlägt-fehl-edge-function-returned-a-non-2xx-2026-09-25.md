# Registrierung schlägt fehl: „Edge Function returned a non-2xx status code"

## Was im Code passiert (geprüft)

Beim Klick auf „Registrierung abschließen" legt der Dienst `send-signup-confirmation` das Konto an. Bevor er überhaupt prüft, ob wir im Mail-losen Betrieb sind, bricht er in diesen Fällen mit Fehler ab:

1. Mandant hat keine vollständigen SMTP-Zugangsdaten → Abbruch „keine SMTP-Konfiguration"
2. Mail-Versand für den Mandanten ist pausiert → Abbruch „pausiert"
3. Mandant deaktiviert / E-Mail gesperrt / bereits registriert

Punkt 1 und 2 sind im Mail-losen Betrieb sinnlos: Es wird ja gar keine Mail verschickt, das Konto wird sofort freigeschaltet. Neue Seiten aus dem Landing-Generator haben in der Regel **keine SMTP-Daten** — genau diese Bewerber scheitern dann. Das passt dazu, dass mehrere Bewerber gleichzeitig betroffen sind. (Die genaue Ursache pro Bewerber wird in Schritt 1 bestätigt.)

Zweiter Fehler: Die Seite soll eigentlich die echte Ursache anzeigen, liest sie aber an der falschen Stelle aus. Deshalb sieht der Bewerber nur den technischen Satz statt z. B. „bereits registriert".

## Änderungen

1. **Ursache bestätigen**: Server-Befehl zum Auslesen der letzten Abbruchgründe (Protokoll der Registrierungen) für Sie bereitstellen.
2. **Mail-los zuerst**: Im Mail-losen Betrieb werden SMTP-Prüfung und Pausen-Prüfung übersprungen. Sperren, deaktivierter Mandant und „bereits registriert" bleiben aktiv.
3. **Echte Fehlermeldung anzeigen**: Die Registrierungsseite zeigt künftig den verständlichen Grund auf Deutsch.
4. **Bereits registriert**: Wer schon ein Konto hat, bekommt den Hinweis „Bitte melden Sie sich an" mit Knopf zur Anmeldung.
5. Gleiche Korrektur im Dienst „Bestätigung erneut senden".

Die 3 betroffenen Bewerber können sich danach einfach erneut registrieren.

## Technisch

- `supabase/functions/send-signup-confirmation/index.ts`: `isMaillessTenant()` vor die SMTP-/`emails_paused`-Checks ziehen; bei Mail-los diese Checks überspringen.
- `supabase/functions/resend-signup-confirmation/index.ts`: analog.
- `src/routes/register.tsx`: Fehler-Body aus `fnErr.context` (ist selbst die `Response`) lesen, Fallback auf `context.response`; bei 409 Login-Link anzeigen.
- Diagnose-SQL: `select created_at, recipient_email, status, error_message from email_send_log where template_name='signup_confirmation' order by created_at desc limit 20;`
- Deploy: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh` (spielt auch die Server-Funktionen ein).
