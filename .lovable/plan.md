# Landing-Generator: 6 neue Premium-Themes + Archiv (nach hochgeladener Spezifikation + Zusatzpunkten)

## Basis (im Code geprüft)
- Themes liegen in `src/landing-themes/<theme>/` (template.html, style.css, script.js, meta.json, assets/); Registrierung in `src/lib/landing-themes.ts` (THEME_LIST, HIDDEN_THEMES, THEME_DISPLAY).
- Bilder werden beim Build in `src/lib/theme-assets.generated.ts` (Base64) gepackt: `bun scripts/build-theme-assets.mjs` — landen in ZIP und beim Live-Server.
- Bestehende Live-Seiten bleiben unangetastet: alte Theme-Ordner bleiben vollständig im Code, nur die Generator-Auswahl wird angepasst.

## Vorab (vor dem Umbau)
- Deckblatt „Login & Status" direkt im Chat für den Kollegen.
- Deckblatt „Landing-Generator" danach — nach dem Umbau, damit es die neue Theme-Welt (6 aktive Themes + Archiv) beschreibt.

## Phase 1 — 6 neue Themes anlegen
Je Theme eigener Ordner, komplett eigener Aufbau (kein Kopieren alter Themes, keine Parallel-Architektur):
1. **Corporate Consulting** — Navy/Anthrazit/Weiß, ruhig, großzügiger Weißraum, klare horizontale Bereiche, dezente Linien.
2. **Modern Business** — dunkles Anthrazit/Off-White, asymmetrische Layouts, Cards, dezente Verläufe.
3. **Minimal Professional** — Weiß/Hellgrau, extrem reduziert, starke Typografie, feine Linien.
4. **Executive Premium** — sehr dunkles Navy/Creme, Editorial-Headlines, große Bildflächen, elegante Zurückhaltung.
5. **Human Business** — warme Neutraltöne/Creme, authentische Menschen, seriös-menschlich.
6. **Digital Professional** — Anthrazit/Navy mit dezenten Blau/Cyan-Akzenten, modernes Grid, subtile technische Elemente.

Regeln (verbindlich):
- Jedes Theme eigene Hero-Komposition, Section-Reihenfolge, Layoutstruktur, Bildkomposition, CTA-Struktur, Karten-Darstellung, Typografie-Hierarchie — 6 erkennbar verschiedene Designkonzepte.
- Farbwelten als Richtung verstehen; professionelle Variationen erlaubt, solange seriös. Verboten: Neon, billige Verläufe, übergroße Schatten, Gold/Glitzer, verspielte Riesen-Icons, aggressive Animationen, Countdown, blinkende CTAs.
- Texte: Default-Slots professionell formuliert — Tätigkeit, Aufgaben, Einarbeitung, Zusammenarbeit, Bewerbungsprozess, klare Erwartungen. Keine Gehaltsversprechen, kein „schnell Geld", kein „du musst nichts können", kein künstlicher Zeitdruck; „Keine Berufserfahrung erforderlich" nur nebensächlich.
- Eigene default-Bilder (assets/) passend zur Bildsprache; dezente Animationen nur (Fade-ins, Hover, sanfte Reveals).
- Eigener visueller Formular-Abschnitt `_shared/form-section-<theme>.html/.css` — nur Darstellung, Formularlogik/Validierung/API/Tenant-Zuordnung unverändert.
- meta.json mit editierbaren Slots — bestehendes Slot-System weiterverwenden, kein neues Backend.
- Responsive von Anfang an, Mobile sinnvoll neu angeordnet.

## Phase 2 — Generator-UI: aktive Themes + Archiv
- Schritt 1 zeigt nur die 6 neuen Themes (Name, Beschreibung, visuelle Preview, Auswahl wie bisher).
- Neuer optisch getrennter Bereich **„Archiv"**: alte Themes ansehbar; bestehende Landings mit altem Theme werden dort weiterhin bearbeitet und laden ihr altes Theme.
- Bei „Neue Landing" sind ausschließlich die 6 neuen Themes auswählbar; Archiv-Themes nie als normale Auswahl.
- Keine automatische Migration alter Landings auf neue Themes; keine bestehende Live-Landing verändern.
- Alles Bestehende bleibt: eigene Vorlagen, gespeicherte Baukasten-Seiten, Duplizieren, Live-Vorschau (inkl. „In neuem Tab öffnen"), Speichern & live schalten, ZIP-Export, Impressumsprüfung, Live/Pausiert, Löschen (Termine bleiben), DNS-Hinweise, SEO-Felder, Tenant-ID, Calendly, KI-Bewerbungsgespräch, Tracking, Meta-Pixel.

## Phase 3 — Verifikation
- `bun scripts/build-theme-assets.mjs`, Typecheck/Build.
- Jedes neue Theme tatsächlich in der Vorschau prüfen bei 390 / 768 / 1024 / 1440 px (Screenshots), auf echte visuelle Probleme achten: Textüberläufe, abgeschnittene Buttons, schlechte Bildzuschnitte, falsche Abstände, kaputte Mobile-Heroes, horizontales Scrollen.
- Bestehende Funktionen durchtesten (Speichern, Bearbeiten, Duplizieren, Vorschau, eigene Vorlagen).
- Nur Landing-Generator + Theme-Dateien verändern; alles andere unverändert.

## Abschluss
- Deployment-Hinweis wie üblich: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`.
- Danach: Deckblatt „Landing-Generator" im Chat mit den 6 neuen Themes + Archiv.
