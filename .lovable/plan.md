# Abschluss: Offene Punkte statt neuer Umbauten

Empfehlung: **Jetzt nichts Neues bauen.** Alle vereinbarten Konversionsmaßnahmen sind
im Code fertig — was fehlt, ist das Rausrollen und die Messung. Erst nach 2–3 Wochen
ehrlich vergleichen, dann entscheiden.

## Offene Punkte (keine Code-Änderung)

1. **Deploy auf dem Server** — wartet seit mehreren Schritten:
   ```bash
   git pull && bash scripts/deploy.sh
   ```
   Danach Landing-Sync ausrollen, damit die Landingpages den Zwei-Minuten-Hinweis
   und die flexible Termin-Botschaft zeigen.

2. **WhatsApp-Nummer im Admin hinterlegen** (pro Mandant): Nummer + aktiv-Schalter
   setzen. Ohne die Nummer bleiben alle WhatsApp-Knöpfe unsichtbar — Danke-Fenster,
   Zusage-Karte, Ausweis-Hilfe wirken sonst wie nicht vorhanden.

3. **Supabase-Auth: „Confirm email“ prüfen/deaktivieren** — damit die Registrierung
   nicht an einer Bestätigungsmail hängt (eigene Mails sind ja abgeschaltet;
   Calendly + WhatsApp reichen). Auf dem eigenen Supabase-Server in
   Auth-Einstellungen umstellen.

4. **Messung vorbereiten:** Vorher-Stand jetzt sichern, damit der Vergleich ehrlich ist:
   ```bash
   DAYS=90 bash scripts/analyze-no-shows.sh --local
   ```
   (Nur SELECTs, nichts wird verändert.) Ausgabe abspeichern — das ist die Basislinie.

## Nach 2–3 Wochen

- `analyze-no-shows.sh` erneut laufen lassen und Vorher/Nachher vergleichen:
  gebucht → erschienen → Zusage → registriert → Vertrag → Ausweis → fertig.
- Erst dann entscheiden, wo der nächste Hebel liegt — Zahlen statt Bauchgefühl.

## Kandidaten für später (bewusst NICHT jetzt)

Nur falls die Messung dort einen Riss zeigt:

- Alt-Route `/termin/$token`: Countdown-Text widerspricht der „Interview ist
  flexibel“-Botschaft.
- Termin-Bucheseite sagt „kein Telefonanruf“, obwohl es einen Sprach-Interview-Weg gibt.
- Support-CTA verlinkt `mailto:` — eigener Mailversand ist aber abgeschaltet.
- Alte Theme-Defaults enthalten noch erfundene Kennzahlen/Stimmen (Social Proof
  ist ja verworfen) — beim nächsten Theme-Touch bereinigen.

## Bewusst nicht Teil dieses Schritts

- Kein neuer Code, kein Social Proof, keine eigenen Mails/Automatik
- Kein Umbau von Registrierung, Zusage oder Terminstrecke
