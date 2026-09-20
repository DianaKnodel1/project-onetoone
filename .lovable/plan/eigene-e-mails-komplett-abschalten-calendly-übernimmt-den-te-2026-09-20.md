# Eigene E-Mails komplett abschalten — Calendly übernimmt den Termin-Funnel

Ziel: Rund um den Termin kommt alles (Bestätigung, Erinnerungen, SMS) nur noch
von Calendly. Das eigene Mail-System schweigt im Bewerber-Funnel vollständig.
Erst später wird die Conversion mit eigenen Mails optimiert (z. B. eine
Eingangsbestätigung, die Calendly nicht hat) — nachdem geklärt ist, warum
eigene Mails nicht im Posteingang landen.

## Ist-Zustand (im Code geprüft)

- Vier Cron-Jobs auf dem eigenen Server schicken Mails:
  - `send-booking-confirmation` (alle 2 Min — Terminbestätigung)
  - `send-appointment-reminders` (alle 10 Min — Einladung 30 Min vorher)
  - `send-application-reminders` (alle 30 Min — Nachfass ohne Termin,
    Nichterscheinen, Wiederbuchen, Registrierung offen + die von mir neu
    eingebauten Erinnerungen 24 h / 1 h vorher)
  - `send-reminders` (stündlich — älterer Reminder-Job)
- Die Eingangsbestätigung bei Bewerbung wird auf Calendly-Seiten bereits
  automatisch übersprungen (`calendly_handles_mail` / `mailless_mode`) —
  da ist nichts mehr zu tun.
- Ein separater Job markiert verpasste Termine als „nicht erschienen"
  (reine Statistik, keine Mail) — der bleibt an.

## Was gebaut wird

1. **Meine neuen Erinnerungs-Mails (24 h / 1 h) werden zurückgebaut.**
   Die Ergänzungen in `send-application-reminders` fliegen wieder raus.
2. **Alle Mail-Cron-Jobs werden abgeschaltet.** Neue manuelle Migration, die
   die vier Jobs aus dem Zeitplan nimmt. Der Code der Funktionen bleibt
   liegen (für die spätere Conversion-Optimierung), es feuert nur nichts
   mehr automatisch. Der reine Status-Job (Termin verpasst → Markierung)
   bleibt aktiv, damit die Statistik stimmt.
3. **Admin bleibt bedienbar.** Die manuellen „Jetzt senden"-Knopfe im Admin
   bleiben bestehen — sie schicken nur auf ausdrücklichen Klick, nichts
   automatisches.

## Nicht Teil dieses Schritts

- Zustell-Check eigener Mails (warum landen sie nicht im Posteingang) —
  kommt als eigener Schritt danach.
- Umbau der Danke-Seite / einheitliche Landing Pages aus dem letzten Plan
  bleibt unverändert bestehen.

## Technische Umsetzung

- `supabase/functions/send-application-reminders/index.ts`: Kinds
  `upcoming_24h` / `upcoming_1h` samt Defaults, Auswahl-Block und
  `isUpcoming`-Logik wieder entfernen.
- Neue Datei `supabase/manual-migrations/20260919000000_disable_mail_crons.sql`:
  `cron.unschedule` für `send-booking-confirmation`,
  `send-appointment-reminders`, `send-application-reminders`,
  `send-reminders-hourly` (fehlende Jobs werden ignoriert).
- Hinweis: `scripts/fix-mail-crons.sh` darf danach nicht mehr ausgeführt
  werden, es würde die Jobs wieder anlegen — Kommentar im Skript ergänzen.
- Am Server ausführen: Migration + `bash scripts/deploy-backend.sh`
  (geänderte Edge Function), Landing-Sync nicht nötig.

## Prüfungen vor dem Abschluss

- `SELECT jobname, active FROM cron.job;` zeigt die vier Mail-Jobs nicht mehr.
- Testbewerbung mit Calendly-Buchung: Bewerber bekommt ausschließlich
  Calendly-Mails/SMS, keine eigene Mail doppelt.
- Verpasster Testtermin wird weiterhin als „nicht erschienen" markiert.
