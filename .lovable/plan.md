# Conversion-Optimierung: Vom Termin zum Erscheinen

Ziel: Mehr gebuchte Bewerber erscheinen zum Gespräch — und wir messen, warum die anderen nicht kommen.

## Erst messen, dann bauen

Du führst einmal das fertige Auswertungs-Skript auf deinem Server aus
(nur lesend, ändert nichts):

```bash
DAYS=90 bash scripts/analyze-no-shows.sh --local
```

Es zeigt u. a.: No-Show-Quote nach Vorlaufzeit (Buchung → Termin), nach
Landing Page, und ob die Calendly-Mails ankamen. Damit wissen wir, ob der
Hebel eher "kürzere Vorlaufzeit", "bestimmte Seiten" oder "Erinnerungen"
ist. Ergebnis einfach hier einfügen.

## Baustein 1: WhatsApp-Bestätigung direkt nach der Buchung (stärkster Hebel)

Auf der Danke-Seite erscheint nach der Terminbuchung ein großer
WhatsApp-Knopf: "Termin kurz bestätigen". Ein Klick öffnet WhatsApp mit
vorgefertigtem Text an deine Nummer ("Hallo, ich bin Maria, mein Termin am
Di 14 Uhr passt"). Wer das macht, hat sich bewusst festgelegt — das ist der
bewährteste Commitment-Trick gegen Nichterscheinen, und du siehst sofort,
wer engagiert ist. Läuft über dein physisches Handy, keine Sperr-Gefahr.

## Baustein 2: WhatsApp-Nachfass im Admin (Termine morgen + Nichterscheiner)

Neue Admin-Ansicht "Termine heute/morgen" und "Nicht erschienen":

- Pro Person ein WhatsApp-Knopf mit fertigem Text
  ("Hallo Maria, morgen 14 Uhr ist dein Gespräch mit …, passt das noch?")
- Bei Nichterscheinern: "Schade, dass es gestern nicht geklappt hat — hier
  kannst du direkt neu buchen: {Terminlink}"
- Ein Klick öffnet wa.me mit der Nummer des Bewerbers — du sendest vom
  physischen Handy, 20–40 Kontakte am Tag sind damit problemlos machbar.

## Baustein 3: Calendly richtig einstellen (bei dir, 10 Minuten)

Ich gebe dir eine kurze Anleitung zum Abhaken:

- SMS-Erinnerung 1 h vorher (hast du) + E-Mail 24 h vorher
- "Reconfirmation"-Funktion aktivieren: Calendly fragt 24 h vorher
  "Bist du dabei? Ja / Verschieben"
- Buchbare Zeiten auf die nächsten 2–3 Tage begrenzen — je kürzer der
  Vorlauf, desto weniger Nichterscheinen (die Auswertung oben zeigt, ob
  das bei deinen Daten stimmt)

## Später (nicht Teil dieses Schritts)

- WhatsApp Business Plattform (360dialog/Twilio) für automatische
  Erinnerungen — sauberer Weg statt Cloud-Phones, die gesperrt werden.
- Landing-Generator umbauen (freiere Gestaltung, bessere Optik) — Thema
  für die Lead-Menge.
- Zustell-Check eigener Mails, falls WhatsApp allein nicht reicht.

## Technisch kurz

- Danke-Karte in `src/landing-themes/_shared/form-section.js`: WhatsApp-Knopf
  mit wa.me-Link (Tenant-Nummer aus dem bestehenden WhatsApp-Support-Feld),
  vorbefüllter Text mit Name + Termin.
- Neue Admin-Route `admin.whatsapp.tsx`: zwei Listen (Termine 24 h /
  No-Shows der letzten 7 Tage) mit wa.me-Aktionen; Navi-Eintrag.
- Keine automatischen Versände, keine eigenen Mails — alles manuell per
  Klick über dein Handy.
- Deploy wie immer: `bash scripts/deploy.sh` + Landing-Sync.

## Erfolg messen

Nach 2–3 Wochen `analyze-no-shows.sh` erneut laufen lassen: No-Show-Quote
vorher/nachher vergleichen.
