# Eigenen Mailversand komplett abschalten — auch die Admin-Knöpfe

Ziel: Dein eigenes Mail-System (SMTP) verschickt nichts mehr — weder
automatisch noch per Knopfdruck. Termin-Mails und SMS kommen ausschließlich
von Calendly. Als Ersatz für Passwort-Probleme bekommen Login und
Registrierung einen sichtbaren Kontakt-Hinweis (E-Mail / WhatsApp).

## Ist-Zustand (im Code geprüft)

- Der zentrale Versand-Wächter (`send-guard.ts`) ist bereits ein HARTER
  RIEGEL: Er lässt grundsätzlich nichts mehr durch — auch kein
  Passwort-Reset. Jeder blockierte Versand wird nur noch protokolliert.
- Im Admin gibt es trotzdem noch Sende-Knöpfe bei jedem Bewerber
  (Mail-Verlauf mit „Jetzt senden" / „Erneut senden" und die
  Wiederholungs-Warteschlange). Sie lösen zwar keinen Versand mehr aus,
  verwirren aber und erzeugen Fehlermeldungen.
- Zwei Rest-Jobs laufen noch im Zeitplan: die Wiederholungs-Warteschlange
  und der SMTP-Gesundheitscheck. Beide sind ohne aktiven Versand nutzlos
  und müllen nur das Protokoll zu.
- WhatsApp-Kontakt ist bereits vorbereitet (einstellbar im Admin,
  Verknüpfung über den bestehenden WhatsApp-Support).

## Was gebaut wird

1. **Admin aufräumen — keine Sende-Knöpfe mehr.**
   - Im Bewerber-Mail-Verlauf (MailChain) verschwinden alle Knöpfe
     („Jetzt senden", „Erneut senden", Resend der Eingangs- und
     Terminbestätigung). Stattdessen steht dort ein Hinweis: „Eigener
     Mailversand deaktiviert — Termin-Mails kommen von Calendly."
   - Die Wiederholungs-Warteschlange (EmailRetryQueuePanel) bekommt
     denselben Hinweis, ihre Sende-Knöpfe fliegen raus.
   - Die Anzeige des Mail-Verlaufs (was wann verschickt/blockiert wurde)
     bleibt lesbar bestehen.
2. **Rest-Jobs aus dem Zeitplan nehmen.** Neue manuelle Migration nimmt
   die Wiederholungs-Warteschlange und den SMTP-Gesundheitscheck aus dem
   Cron-Zeitplan (falls vorhanden, auch den Chat-Erinnerungs-Job).
   Status-Jobs (z. B. „Termin verpasst" markieren) und Domain-Checks
   bleiben an.
3. **Login & Registrierung: Kontakt statt Mail.**
   - Auf der Anmeldeseite erscheint ein Hinweis: „Probleme beim Anmelden
     oder Passwort vergessen? Schreib uns per WhatsApp oder E-Mail." —
     WhatsApp-Knopf nur, wenn im Admin eine Nummer hinterlegt ist
     (bestehende Funktion), sonst nur die E-Mail-Adresse.
   - Dafür brauche ich von dir: die Kontakt-E-Mail-Adresse, die dort
     stehen soll.
4. **Registrierung ohne Mail sicherstellen.** Damit sich neue Mitarbeiter
   ohne Bestätigungs-Mail anmelden können, muss auf deinem Server in den
   Supabase-Auth-Einstellungen „Confirm email" aus sein. Ich baue eine
   Prüfung in den Abschluss — das ist eine Einstellung auf deinem Server,
   keine Codeänderung.

## Nicht Teil dieses Schritts (auf deine Liste für später)

- **WhatsApp als Funnel-Kanal** (Termine sichern, Nachfassen). Mein
  Rat kurz: Cloud-Phones und mehrere SIM-Karten verletzen die
  WhatsApp-Regeln — deshalb die Sperrungen. Der saubere Weg für
  20–40 Kontakte am Tag ist die offizielle WhatsApp Business Plattform
  über einen Anbieter wie 360dialog oder Twilio: kein Ban-Risiko,
  Vorlagen für Erinnerungen, mehrere Mitarbeiter auf einer Nummer.
  Das physische Handy mit eSIM kannst du zusätzlich als Business-App-
  Nummer für persönliche Nachfass-Kontakte nutzen.
- **Landing-Page-Generator umbauen** (freiere Gestaltung statt nur
  vorgegebener Seiten) — eigener Schritt, wenn der Funnel danach
  immer noch hakt.
- **Zustell-Check eigener Mails** — nur falls du eigene Mails später
  doch wieder willst.

## Technische Umsetzung

- `src/components/mail/MailChain.tsx`: alle Sende-Aktionen entfernen
  (triggerReminderNow, resendEmailLog, resendApplicationReceived,
  resendBookingConfirmation), Hinweis-Baustein einbauen; Verlauf bleibt
  rein lesend.
- `src/components/admin/EmailRetryQueuePanel.tsx`: Retry-Knöpfe
  entfernen, Hinweis einbauen.
- `src/routes/login.tsx` (+ Register, falls vorhanden): Kontakt-Hinweis
  mit bestehendem `useWhatsAppSupport()`-Hook und hinterlegter
  Support-E-Mail (Konstante, von dir geliefert).
- Neue Datei
  `supabase/manual-migrations/20260920000000_disable_remaining_mail_crons.sql`:
  `cron.unschedule` für `process-invite-resend-queue`,
  `smtp-health-cron` und `send-chat-reminder` (fehlende Jobs werden
  ignoriert).
- Am Server ausführen: Migration + `bash scripts/deploy.sh`.
  Zusätzlich prüfen: Supabase Auth → „Confirm email" ist deaktiviert.

## Prüfungen vor dem Abschluss

- Admin-Bewerberansicht zeigt keinen einzigen Sende-Knopf mehr, nur den
  Hinweis.
- `SELECT jobname FROM cron.job;` zeigt keine Mail-Jobs mehr.
- Test: Registrierung eines Test-Mitarbeiters funktioniert ohne Mail.
- Login-Seite zeigt den Kontakt-Hinweis; WhatsApp-Knopf erscheint nur
  mit hinterlegter Nummer.
