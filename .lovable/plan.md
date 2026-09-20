# Conversion-Optimierung: Vom gebuchten Termin zum Erscheinen

Ziel: Mehr gebuchte Bewerber erscheinen zum Gespräch.

## Was gebaut wird (Danke-Seite nach der Buchung)

1. **WhatsApp-Bestätigungs-Knopf.** Nach der Terminbuchung erscheint ein
   großer WhatsApp-Knopf: „Termin kurz bestätigen". Ein Klick öffnet
   WhatsApp mit vorgefertigtem Text an eure Nummer („Hallo, ich bin Maria,
   mein Termin am Dienstag um 14 Uhr passt"). Wer bestätigt, hat sich
   bewusst festgelegt — und ihr seht sofort, wer engagiert ist. Läuft über
   das physische Handy, keine Sperr-Gefahr. Nummer kommt aus dem
   bestehenden WhatsApp-Feld des Mandanten.

2. **„In Kalender speichern"-Knopf.** Google-Kalender und Apple/Outlook
   (.ics) direkt auf der Danke-Seite — der Termin steht im eigenen
   Kalender mit eigener Erinnerung, unabhängig von jeder Mail.

3. **Klare Termin-Karte mit Countdown.** „Dein Gespräch: Dienstag,
   14:00 Uhr · mit {Name} · ca. 15 Minuten · Video" plus Countdown bis
   zum Termin. Kein Raum für Unsicherheit, was wann mit wem passiert.

4. **Hemmschwelle senken.** Ein Satz auf der Danke-Seite: „Kein steifes
   Bewerbungsgespräch — wir lernen uns locker kennen, du brauchst nichts
   vorzubereiten." Viele erscheinen nicht, weil sie Lampenfieber bekommen.

## Nicht Teil dieses Schritts

- Calendly-Anleitung (SMS 1 h vorher, Reconfirmation aktivieren,
  Vorlaufzeit auf 2–3 Tage begrenzen) — liefern wir auf Wunsch später.
- WhatsApp Business Plattform (360dialog/Twilio) für automatische
  Erinnerungen — späterer Schritt, wenn das Volumen wächst.
- Admin-Listen für manuelles Nachfassen — vom Nutzer verworfen.

## Messung (ehrlich)

Ob Calendly-Mails ankommen, ist von außen nicht sichtbar. Gemessen wird
das Ergebnis: das Skript `analyze-no-shows.sh` (nur lesend) vergleicht
gebuchte Termine mit abgeschlossenen Gesprächen. Nach 2–3 Wochen erneut
laufen lassen und die Erscheinensquote vorher/nachher vergleichen:

```bash
DAYS=90 bash scripts/analyze-no-shows.sh --local
```

## Technisch kurz

- `src/landing-themes/_shared/form-section.js`: Danke-Karte nach
  Calendly-Buchung um WhatsApp-Knopf (wa.me mit vorbefülltem Text),
  Kalender-Buttons (Google-URL + .ics-Download) und Countdown erweitern.
  Termin-Daten (Datum/Uhrzeit) kommen aus der Calendly-Event-Antwort,
  die nach der Buchung vorliegt.
- Keine automatischen Versände, keine eigenen Mails — alles passiert im
  Browser des Bewerbers.
- Deploy wie immer: `bash scripts/deploy.sh` + Landing-Sync.
