# Mailversand komplett aus – Prüfung und Absicherung

## Ergebnis der Prüfung
- Richtig: Im Code ist der Mailversand grundsätzlich abgeschaltet. Die zentrale Regel „Mail-los-Modus“ steht fest auf „an“, kein Schalter kann das wieder einschalten. Calendly übernimmt Termin-Mails und SMS.
- Der Fehler bei den 3 Bewerbern: Die Registrierung hat **vor** dieser Regel noch geprüft, ob Mail-Zugangsdaten hinterlegt sind, und ist deshalb abgebrochen. Das ist im Code schon behoben, aber **noch nicht auf dem Datenbank-Server eingespielt**. Dort läuft noch die alte Version, deshalb kann der Fehler weiter auftreten.
- Weitere Funktionen haben dieselbe falsche Reihenfolge (prüfen Mail-Zugangsdaten, bevor sie merken, dass sowieso nichts verschickt wird):
  - Bestätigungs-Mail erneut senden (Knopf auf Login-/Registrierungsseite) → zeigt Fehlermeldung
  - Bewerbungseingang / Interview-Einladung → erzeugt Fehler-Einträge im Protokoll, Bewerbung selbst wird trotzdem gespeichert
  - Chat-Erinnerung → Fehler-Eintrag

## Was ich umsetze
1. Alle Mail-Funktionen prüfen den Mail-los-Modus als **allererstes** und melden dann ruhig „übersprungen“ statt Fehler – keine Abbrüche, keine roten Meldungen mehr.
2. „Bestätigung erneut senden“-Knöpfe auf Login und Registrierung ausblenden (Konten sind sofort aktiv, der Knopf ist sinnlos).
3. Ihnen genau einen Befehl geben, der alle Funktionen auf dem Datenbank-Server neu einspielt – erst danach wirkt der Fix für die Bewerber.

Passwort-Zurücksetzen bleibt wie bisher (einzige bewusste Ausnahme).

## Technische Details
- Dateien: `send-invitation-email`, `resend-signup-confirmation`, `send-chat-reminder`, `send-appointment-reminders` – früher Return nach `isMaillessTenant()` vor SMTP-/Pausen-Checks, Log-Status `skipped` mit Grund `mailless_mode`, HTTP 200.
- `src/routes/login.tsx`, `src/routes/register.tsx`: Resend-Button entfernen.
- Deploy: `supabase functions deploy` für alle geänderten Funktionen auf dem Datenbank-Server + Portal-Deploy.
- Kontrolle danach: `select created_at, status, error_message from email_send_log order by created_at desc limit 20` – es darf kein `smtp_not_configured` mehr auftauchen.
