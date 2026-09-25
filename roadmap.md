# Roadmap

## Offen
- [ ] Portal-Branding deployen: Landing-Generator überträgt Firmenname, Logo, Kontakt-E-Mail, Farbe und Portal-Domain automatisch; Migration `20260923060000_portal_branding_public.sql`
- [ ] Landing-Baukasten nach Deploy mit Admin-Konto prüfen: Vorschau lädt ohne „Admin-Rechte erforderlich"
- [ ] Deploy ausstehend (betrifft ALLE umgesetzten Punkte unten): `git pull && bash scripts/deploy.sh` + Landing-Sync auf dem Server
- [ ] Landing-Sync inkl. neuer Datei: `bash scripts/sync-landing-server.sh` schiebt jetzt auch `sections-renderer.js` (Baukasten-Renderer) auf Server 1
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
- [x] Login/Registrierung auf Landing-Daten vereinheitlicht; feste fremde Support-Adresse entfernt
- [x] Migrationen `20260922000000_landing_sections.sql` und `20260922010000_landing_media_bucket.sql` erfolgreich auf dem Backend angewendet
- [x] Landing-Baukasten: falsche Admin-Prüfung über `profiles.role` auf `user_roles` korrigiert
- [x] Baukasten: direkter Bild-Upload in allen Bild-Feldern (Bucket „landing-media", Upload-Button + Vorschau, URL weiterhin möglich) + neuer Abschnitt „Text & Bild" (Bild links/rechts) — umgesetzt, wartet auf Deploy + Media-Migration
- [x] Landing-Baukasten: Abschnitts-Katalog + Renderer (`src/lib/landing-sections.ts`, Mirror `landing-server/sections-renderer.js`), Renderer-Branch in server.js/server.ts, Sync per Heartbeat/sync-Skript, Admin-Editor `/admin/landing-baukasten` mit Live-Vorschau — umgesetzt, wartet auf Deploy + Migration + Sync
- [x] Baukasten visuell bedienbar: Klick/Bearbeiten direkt in der Vorschau (Overlay nur im Admin), „+"-Knöpfe zwischen Abschnitten, Ziehen zum Umsortieren, Vorlagen für neue Seiten, automatische Vorschau, Verwerfen-Knopf, Desktop/Handy-Umschalter
- [x] Zwei-Minuten-Hinweis am ersten Bewerbungsaufruf und klare Datenerklärung vor dem Ausweis-Upload — umgesetzt, wartet auf Deploy
- [x] Meta-Pixel-Infrastruktur (ID-Feld, PageView/Lead, Consent) — live
- [x] /danke-Weiterleitung + Cache-Buster — live
- [x] Eigenes Feld „Eigener Meta-Pixel-Code“ pro Landing Page (überschreibt Pixel-ID, Consent + Lead bleiben) — umgesetzt, wartet auf Deploy
- [x] Vertrauen sichtbar machen (Zusage-Ansprechpartner + Firmenangaben, Begründungen an Ausweis-/Personal-Daten-Schritt, flexible Termin-Botschaft auf Landing) — umgesetzt, wartet auf Deploy
- [x] WhatsApp-Bestätigung/Zusage-Umbau (Zusage-Karte ohne Auto-Redirect, WhatsApp-Hilfe, Registrierungs-Trichter in Analyse) — umgesetzt, wartet auf Deploy

## Landing-Baukasten mit KI (23.09.)
- [x] Flow vereinheitlicht: neue Seiten immer „Direkt", Vermittlung nur noch als Bestand sichtbar
- [x] Design-Ebene (Farben, Schrift, Rundungen, Abstände, hell/dunkel, Hero-Varianten)
- [x] KI-Entwurf (Texte + Abschnitte + Design) und „Design neu würfeln"
- [x] KI-Bilder pro Bildfeld (Speicher: landing-media)
- [x] Eigene Vorlagen (Tabelle landing_templates)
- [ ] Deploy: git pull && bash scripts/deploy.sh (Migration 20260923000000_landing_templates.sql), danach bash scripts/sync-landing-server.sh
- [ ] Live-Test: KI-Entwurf + KI-Bild mit hinterlegten KI-Zugangsdaten

## Schnell-Generator (24.09.)
- [x] Vier Master-Vorlagen (Seriöser Dienstleister, Moderne Digital-Agentur, Kompakter Schnelleinstieg, Warm & persönlich) mit festem Aufbau + eigener Farbwelt
- [x] 1-Klick-Generierungsfenster: Vorlage wählen + Firmenname/Stelle/Stichworte → komplette Seite; Grundeinstellungen öffnen sich direkt
- [x] Bewerbungsformular wird immer automatisch als letzter Abschnitt gesetzt (Trichter bleibt stabil)
- [x] „Seite duplizieren": bestehende Seite als neue Seite mit freiem Kurznamen weiterverwenden
- [ ] Live-Test nach Deploy: je eine Seite pro Master-Vorlage generieren und vergleichen
- [x] Ident-Mirror für Kunden gebaut (`ident-mirror-server/`): Proxy WebID+POSTIDENT, eigenes Passwort-Panel, Setup-Skript — lokal durchgetestet; liegt auf webid-portal.com (Port 3003), bleibt als separate Installation bestehen
- [x] Kurswechsel 23.09.: Ident-Mirror nicht als Ablösung — altes WebID-Modul im Portal reaktiviert (Admin /admin/webid-sim, Mitarbeiter-Karte), webid-sim bleibt aktiv
- [x] WebID-Modul vereinfacht: Tab Zuweisungen + Vorgänge entfernt; eine zentrale Meldung (`webid_sim_notice`) in /admin/webid-sim editierbar, erscheint automatisch auf allen Sim/Tunnel-Seiten (Migration 20260923050000_webid_notice.sql, webid-sim-server/server.ts auf Meldung umgestellt) — wartet auf Deploy
- [ ] Portal-Server: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh` (spielt Migration 20260923050000 ein)
- [ ] WebID-Server: webid-sim Code aktualisieren (`SIM_BASE_DOMAIN=webid-portal.de bash webid-sim-server/setup.sh` oder Dateien kopieren) + `systemctl restart webid-sim`; Caddy-Duplikat für webid-portal.com entfernen (`caddy validate && systemctl restart caddy`); Wildcard-Block `*.webid-portal.de` in Caddyfile prüfen; Test `curl http://127.0.0.1:3002/_health`
- [ ] Test: /admin/webid-sim → Meldung ändern → nach ~10 Sek. auf Sim-Domain sichtbar; Mitarbeiter-Karte am Auftrag prüfen
