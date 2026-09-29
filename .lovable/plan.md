# Landing-Generator: 6 neue Premium-Themes + Archiv (nach hochgeladener Spezifikation)

## Basis (im Code geprüft)
- Themes liegen in `src/landing-themes/<theme>/` (template.html, style.css, script.js, meta.json, assets/). Registrierung in `src/lib/landing-themes.ts` (THEME_LIST, HIDDEN_THEMES, THEME_DISPLAY).
- Alle Bilder werden beim Build in `src/lib/theme-assets.generated.ts` (Base64) gepackt: `bun scripts/build-theme-assets.mjs` — so landen sie in der ZIP und beim Live-Server.
- Bestehende Live-Seiten bleiben unangetastet: alte Theme-Ordner bleiben vollständig im Code, nur die Auswahl im Generator wird angepasst.

## Vorab (vor dem Umbau)
- Die zwei angefragten Deckblätter (Anleitungen) kommen direkt im Chat: erst **Login & Status**, dann **Landing-Generator** — das Landing-Deckblatt nach dem Umbau, damit es die neue Theme-Welt beschreibt.

## Phase 1 — 6 neue Themes anlegen
Je Theme ein eigener Ordner mit komplett eigenem Aufbau (kein Kopieren alter Themes):
1. **corporate-consulting** — Navy/Anthrazit/Weiß, ruhig, großzügiger Weißraum, klare horizontale Bereiche, dezente Linien.
2. **modern-business** — dunkles Anthrazit/Off-White, asymmetrische Layouts, Cards, dezente Verläufe.
3. **minimal-professional** — Weiß/Hellgrau, extrem reduziert, starke Typografie, feine Linien.
4. **executive-premium** — sehr dunkles Navy/Creme, Editorial-Headlines, große Bildflächen, elegante Zurückhaltung (kein Gold/Glitzer).
5. **human-business** — warme Neutraltöne/Creme, authentische Menschen, seriös-menschlich.
6. **digital-professional** — Anthrazit/Navy mit dezenten Blau/Cyan-Akzenten, modernes Grid, subtile technische Elemente (kein Neon/Gaming).

Pro Theme:
- Eigene Section-Reihenfolge und Hero-Aufbau (gemäß Spezifikation unterschiedlich je Theme).
- Eigene Typografie (Google-Fonts je Theme), eigene Bildpositionierung, eigene Karten/CTA-Gestaltung, dezente Animationen (nur Fade-ins, Hover, sanfte Reveals — kein Blinken/Countdown).
- Text-Welt: seriös — Tätigkeit, klare Aufgaben, Einarbeitung, professioneller Bewerbungsprozess; KEIN Gehalt/Homeoffice/„schnell Geld"-Fokus.
- Eigene default-Bilder (assets/) passend zur Bildsprache des Themes.
- Eigener Formular-Abschnitt `_shared/form-section-<theme>.html/.css` im Look des Themes, Anschluss an das bestehende Bewerbungsformular-System.
- meta.json mit editierbaren Slots (Texte, Bilder, Farben) — bestehendes Slot-System, kein neues Backend.
- Responsive von Anfang an: geprüft bei 390/768/1024/1440 px, sinnvolle Mobile-Neuanordnung, keine Überläufe.

## Phase 2 — Generator-UI: aktive Themes + Archiv
- Schritt 1 zeigt nur die 6 neuen Themes (Name, Beschreibung, visuelle Preview, Auswahl wie bisher).
- Neuer optisch getrennter Bereich **„Archiv"**: alle alten Themes weiterhin ansehbar/auswählbar, aber klar abgesetzt (z. B. eingeklappt), nicht Standard bei „Neue Landing".
- Alles Bestehende bleibt: eigene Vorlagen, gespeicherte Baukasten-Seiten, Duplizieren, Bearbeiten, Live-Vorschau (inkl. „In neuem Tab öffnen"), Speichern & live schalten, ZIP-Export, Impressumsprüfung, Live/Pausiert, Löschen (Termine bleiben), DNS-Hinweise, SEO-Felder.
- Bestehende Landing auf altem Theme wird beim Bearbeiten weiter mit ihrem alten Theme geladen — keine automatische Migration.

## Phase 3 — Verifikation
- `bun scripts/build-theme-assets.mjs`, Typecheck/Build.
- Jedes neue Theme in der Live-Vorschau und bei 390/768/1024/1440 px prüfen (Screenshots).
- Bestehende Funktionen durchtesten (Speichern, Bearbeiten, Duplizieren, Vorschau, eigene Vorlagen).
- Keine Änderungen außerhalb des Landing-Generators (keine DB-, Auth-, Portal-, API-Änderungen).

## Abschluss
- Deployment-Hinweis wie üblich: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`.
- Danach: Deckblatt „Landing-Generator" im Chat mit den 6 neuen Themes + Archiv.
