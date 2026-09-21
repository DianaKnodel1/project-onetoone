# Conversion-Optimierung: Vom Lead zum fertigen Mitarbeiter

Der Screenshot aus dem Admin bestätigt beide Baustellen: Termine werden
gebucht, aber nicht wahrgenommen („Nicht erschienen"), und Zusagen führen
nicht zur fertigen Registrierung (Fortschritt bleibt vor „Portal" stehen).

## Schritt 1: WhatsApp als roter Faden (größter Hebel)

1. **Danke-Seite nach der Buchung**: großer WhatsApp-Knopf „Termin kurz
   bestätigen" mit vorgefertigtem Text an eure Nummer (Name + Termin).
   Wer bestätigt, legt sich bewusst fest. Dazu neutraler Gesprächs-Text:
   „kurzes Kennenlerngespräch, ca. 15 Minuten, bequem vom Handy" —
   kein „Video", kein „schriftlich/Chat".
2. **Zusage-Karte im Portal**: WhatsApp-Knopf „Fragen? Schreib mir
   direkt" mit vorgefertigtem Text. Wer einen echten Ansprechpartner hat,
   bricht viel seltener ab.
3. **Ausweis-Alternative „per WhatsApp senden"**: Beim Ausweis-Schritt
   ein Hinweis „Kein Upload möglich? Schick das Foto einfach per
   WhatsApp — wir kümmern uns um den Rest." Senkt die technisch
   heikelste Hürde.

## Schritt 2: Registrierung leichter machen (Zusage → fertig)

1. **Vertrag vorausfüllen**: Name, Adresse und alles, was aus der
   Bewerbung schon bekannt ist, steht schon im Vertrag — nur prüfen
   statt tippen.
2. **Fortschrittsanzeige mit Zeitversprechen**: „Schritt 1 von 3 ·
   dauert 2 Minuten" — das Gefühl „ich bin fast durch" hält die Leute
   im Prozess.
3. **Nutzen klar machen**: Über dem Vertrag ein Satz „Vertrag ausgefüllt
   = Starttermin + erster Lohn".
4. **Zusage-Karte entschärfen**: Die automatische 8-Sekunden-Weiterleitung
   zur Registrierung kann überrumpeln; stattdessen klarer Knopf +
   WhatsApp-Hilfe (aus Schritt 1).

## Schritt 3: Erst danach — Auswertung zum Vorher/Nachher-Vergleich

Read-only Auswertung (Erweiterung von `analyze-no-shows.sh`) zeigt den
kompletten Trichter in Zahlen, damit wir nach 2–3 Wochen ehrlich messen
können, ob es besser wurde:

```text
Bewerbung -> Termin gebucht -> erschienen -> Zusage
          -> registriert -> Vertrag ausgefüllt -> Ausweis -> fertig
```

## Erledigt außerhalb dieses Plans

Calendly-Einstellungen (kurze Vorlaufzeit, Reconfirmation, SMS) hast du
bereits gemacht — die Checkliste dazu schicke ich dir separat im Chat.

## Nicht Teil dieses Schritts

- Kalender-Speichern-Knopf (verworfen)
- Admin-Listen für manuelles Nachfassen (verworfen)
- WhatsApp Business Plattform (360dialog/Twilio) — später, wenn das
  Volumen über das physische Handy hinauswächst
- Eigene Mails bleiben komplett aus — Calendly + WhatsApp reichen

## Technisch kurz

- `src/landing-themes/_shared/form-section.js`: WhatsApp-Bestätigungs-Knopf
  + neutraler Gesprächs-Text auf der Danke-Karte (wa.me, Nummer aus dem
  WhatsApp-Feld des Mandanten).
- `src/components/interview/ZusageCard.tsx`: WhatsApp-Hilfe-Knopf,
  Auto-Weiterleitung durch klaren Knopf ersetzt.
- `src/components/register/StepIdentity.tsx`: Hinweis „Ausweis per
  WhatsApp senden" als Alternative unter dem Upload.
- Vertrags-Schritt (`src/components/register/StepContract.tsx`): Felder
  aus den Bewerbungsdaten vorausfüllen; Fortschrittsanzeige mit
  Zeitversprechen im Registrierungs-Ablauf (`src/routes/register.tsx`).
- `scripts/analyze-no-shows.sh`: neuer Abschnitt „Registrierungs-Trichter"
  (Zusage → Registrierung → Vertrag → Ausweis → fertig), nur SELECTs.
- Keine automatischen Versände, keine eigenen Mails.
- Deploy: `bash scripts/deploy.sh` + Landing-Sync.
