# Roadmap

## Aktiv: Landing-Generator Theme-Überarbeitung (Plan genehmigt 2026-09-29)
- [ ] Deckblatt „Login & Status" im Chat an Kollegen senden
- [ ] 6 neue Themes anlegen (corporate-consulting, modern-business, minimal-professional, executive-premium, human-business, digital-professional) — je eigenes Layout/Hero/Typo/Bilder/CTA + eigener Formular-Abschnitt (nur Optik) + meta.json-Slots
- [ ] Bilder für alle 6 Themes generieren (assets/)
- [ ] Registry: nur 6 neue Themes aktiv, alte in „Archiv"; „Neue Landing" nur neue; bestehende Landings behalten altes Theme (keine Migration)
- [ ] Verifikation: build-theme-assets.mjs, Typecheck/Build, jedes Theme bei 390/768/1024/1440 px in der Vorschau prüfen
- [ ] Bestehende Funktionen checken (Speichern, Bearbeiten, Duplizieren, Vorschau, eigene Vorlagen)
- [ ] Deckblatt „Landing-Generator" im Chat senden (mit 6 Themes + Archiv)
- Deploy: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`

## Hintergrund / fertig
- Vorlagen sind jetzt alle „direkt" (kein Fast-Track/Vermittlung bei neuen Seiten) — Teil 1 erledigt 2026-09-29.
- Stichprobe alt (amber-consult, device-stack, quality-report) — überholt durch die komplette neue Theme-Welt.
