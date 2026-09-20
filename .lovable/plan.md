# Conversion-Optimierung: Vom Lead zum fertigen Mitarbeiter

Ziel: Mehr Bewerber erscheinen zum Gespräch UND mehr Zusagen werden zu
fertig registrierten Mitarbeitern (Vertrag + Ausweis).

## Schritt 0: Erst genau hinschauen (kein Neubau nötig)

Die Datenbank weiß bereits, wer sich registriert hat, ob der Vertrag
ausgefüllt ist und ob der Ausweis hochgeladen wurde. Ein read-only
Auswertungs-Skript (Erweiterung von `analyze-no-shows.sh`) zeigt den
kompletten Trichter in Zahlen:

```text
Bewerbung -> Termin gebucht -> erschienen -> Zusage
          -> registriert -> Vertrag ausgefüllt -> Ausweis hochgeladen -> fertig
```

Damit wissen wir genau, ob die 8 von 10 an der Registrierung selbst, am
Vertrag oder am Ausweis hängen bleiben — und bauen dann gezielt an der
richtigen Stelle statt zu raten. Du führst das Skript auf deinem Server
aus und fügst das Ergebnis hier ein.

## Schritt 1: WhatsApp als roter Faden durch beide Funnels

Der persönliche Kontakt vom echten Handy ist der stärkste Hebel für beide
Probleme. Gebaut wird:

1. **Danke-Seite nach der Buchung**: großer WhatsApp-Knopf „Termin kurz
   bestätigen" mit vorgefertigtem Text an eure Nummer (Name + Termin).
   Wer bestätigt, legt sich bewusst fest — und ihr seht sofort, wer
   engagiert ist.
2. **Zusage-Karte im Portal**: WhatsApp-Knopf „Fragen? Schreib mir direkt"
   mit vorgefertigtem Text („Hallo, ich bin Maria, habe gerade die Zusage
   bekommen und brauche kurz Hilfe"). Wer einen echten Ansprechpartner
   hat, bricht viel seltener ab.
3. **Ausweis-Alternative „per WhatsApp senden"**: Beim Ausweis-Schritt
   ein Hinweis „Kein Upload möglich? Schick das Foto einfach per WhatsApp
   an uns — wir kümmern uns." Senkt die technisch heikelste Hürde.
4. **Neutraler Interview-Text** auf der Danke-Seite: „kurzes
   Kennenlerngespräch, ca. 15 Minuten, bequem vom Handy" — kein „Video",
   kein „schriftlich/Chat".

## Schritt 2: Calendly-Anleitung (bei dir, ca. 10 Minuten)

Kurze Abhak-Liste, die ich dir schreibe:

- Buchbare Zeiten auf die nächsten 1–3 Tage begrenzen (größter Hebel
  gegen No-Shows)
- Reconfirmation aktivieren („Bist du dabei? Ja / Verschieben", 24 h vorher)
- SMS-Erinnerung 1 h vorher prüfen

## Schritt 3 (danach, datenbasiert): Onboarding vereinfachen

Je nachdem, was Schritt 0 zeigt:

- Bricht es bei der **Registrierung selbst**: Zusage-Karte entschärfen,
  Registrierung auf das Nötigste reduzieren, Rest später.
- Bricht es am **Vertrag**: Felder aus der Bewerbung vorausfüllen,
  Fortschrittsanzeige „Schritt 1 von 3 · dauert 2 Minuten", Nutzen-Text
  „Vertrag ausgefüllt = Starttermin + erster Lohn".
- Bricht es am **Ausweis**: WhatsApp-Weg (Schritt 1.3) pushen, Upload
  am Handy vereinfachen.

## Nicht Teil dieses Schritts

- Kalender-Speichern-Knopf (verworfen — zu kleiner Hebel)
- Admin-Listen für manuelles Nachfassen (verworfen)
- WhatsApp Business Plattform (360dialog/Twilio) — später, wenn das
  Volumen über das physische Handy hinauswächst
- Eigene Mails bleiben komplett aus — alles läuft über Calendly + WhatsApp

## Messung

Vorher/Nachher-Vergleich mit dem Auswertungs-Skript (Schritt 0) nach
2–3 Wochen: Erscheinensquote und Quote „Zusage → fertig registriert".

## Technisch kurz

- `scripts/analyze-no-shows.sh`: neuer Abschnitt „Registrierungs-Trichter"
  (Zusage → profiles vorhanden → Vertrag → kyc_verifications → fertig),
  nur SELECTs.
- `src/landing-themes/_shared/form-section.js`: WhatsApp-Bestätigungs-Knopf
  + neutraler Gesprächs-Text auf der Danke-Karte (wa.me, Nummer aus dem
  WhatsApp-Feld des Mandanten).
- `src/components/interview/ZusageCard.tsx`: WhatsApp-Hilfe-Knopf.
- `src/components/register/StepIdentity.tsx`: Hinweis „Ausweis per
  WhatsApp senden" als Alternative unter dem Upload.
- Keine automatischen Versände, keine eigenen Mails.
- Deploy: `bash scripts/deploy.sh` + Landing-Sync.
