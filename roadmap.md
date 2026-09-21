# Roadmap

## Offen
- [ ] Deploy ausstehend (betrifft ALLE umgesetzten Punkte unten): `git pull && bash scripts/deploy.sh` + Landing-Sync auf dem Server
- [ ] WhatsApp-Nummer + aktiv-Schalter im Admin (pro Mandant) hinterlegen — sonst bleiben alle WhatsApp-Knöpfe unsichtbar
- [ ] Supabase-Auth: „Confirm email“ prüfen/deaktivieren (eigene Mails sind aus; Registrierung darf nicht an Bestätigungsmail hängen)
- [ ] Basislinie sichern: `DAYS=90 bash scripts/analyze-no-shows.sh --local` (nur SELECTs), Ausgabe abspeichern
- [ ] In 2–3 Wochen: Analyse erneut laufen lassen, Vorher/Nachher vergleichen (gebucht → erschienen → Zusage → registriert → Vertrag → Ausweis → fertig)

## Später (nur falls Messung dort einen Riss zeigt)
- Alt-Route `/termin/$token`: Countdown-Text widerspricht „Interview ist flexibel“
- Termin-Bucheseite sagt „kein Telefonanruf“, obwohl es einen Sprach-Interview-Weg gibt
- Support-CTA verlinkt `mailto:` — eigener Mailversand ist abgeschaltet
- Alte Theme-Defaults mit erfundenen Kennzahlen/Stimmen bereinigen (Social Proof verworfen)

## Erledigt
- [x] Zwei-Minuten-Hinweis am ersten Bewerbungsaufruf und klare Datenerklärung vor dem Ausweis-Upload — umgesetzt, wartet auf Deploy
- [x] Meta-Pixel-Infrastruktur (ID-Feld, PageView/Lead, Consent) — live
- [x] /danke-Weiterleitung + Cache-Buster — live
- [x] Eigenes Feld „Eigener Meta-Pixel-Code“ pro Landing Page (überschreibt Pixel-ID, Consent + Lead bleiben) — umgesetzt, wartet auf Deploy
- [x] Vertrauen sichtbar machen (Zusage-Ansprechpartner + Firmenangaben, Begründungen an Ausweis-/Personal-Daten-Schritt, flexible Termin-Botschaft auf Landing) — umgesetzt, wartet auf Deploy
- [x] WhatsApp-Bestätigung/Zusage-Umbau (Zusage-Karte ohne Auto-Redirect, WhatsApp-Hilfe, Registrierungs-Trichter in Analyse) — umgesetzt, wartet auf Deploy
