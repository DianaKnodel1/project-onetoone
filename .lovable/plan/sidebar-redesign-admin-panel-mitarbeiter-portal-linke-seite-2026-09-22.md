# Sidebar-Redesign: Admin Panel & Mitarbeiter-Portal (linke Seite)

## Ziel

Die linke Navigation wirkt aktuell generisch: fast weißer Hintergrund, grelle blaue
Aktiv-Pills (`bg-blue-600`), laute rote Zähler-Badges, uppercase Mini-Gruppenlabels und
uneinheitliche Icon-Größen/Strokes. Ziel: seriöser, professioneller, ruhiger — ohne
Änderung an Funktionalität (Einklappen, Badges, gesperrte Punkte, Mobile-Bottom-Nav bleiben).

## Geltungsbereich

- `src/components/AdminLayout.tsx` — AdminSidebar (gruppierte Navigation)
- `src/components/EmployeeLayout.tsx` — EmployeeSidebar (flache Liste, Sperren, Mobile-Bottom-Nav)
- `src/styles.css` — Sidebar-Design-Tokens (`--sidebar*`), keine Hardcoded-Farben in Komponenten
- Umsetzung erst nach deiner Varianten-Wahl; beide Portale bekommen dieselbe Bildsprache

## Drei Varianten zur Auswahl

### Variante A — „Dunkle Executive" (empfohlen)

Anmutung wie ein seriöses Firmen-Intranet: immer dunkle, schmale Seitenleiste
(tiefes Marineblau/Anthrazit, auch im Hell-Modus), Inhalte bleiben hell.

- Aktiver Punkt: dezente hellere Fläche + feiner 2-Pixel-Akzentbalken links, kein grelles Blau
- Icons: einheitlich 18 px, Strichstärke 1.5, monochrom in gedämpftem Weiß; aktiv in Akzentfarbe
- Gruppenlabels: kleiner, weiter aufgelockert, mehr Luft zwischen den Gruppen
- Zähler-Badges: statt Knallrot ein gedämpfter Ton, nur noch sichtbar wenn nötig
- Brand-Bereich oben: ruhiger, mit feiner Trennlinie

Wirkung: hochwertig, seriös, klarste Trennung Navigation/Inhalt.

### Variante B — „Helle Business"

Bleibt hell, aber deutlich verfeinert: warm-neutrale Grautöne statt Blauweiß.

- Aktiver Punkt: weiche getönte Fläche in Primärfarbe (10 %), Text in voller Deckkraft,
  feiner Indikatorbalken links statt Pill
- Icons: einheitlich, feinerer Strich, aktives Icon in Primärfarbe
- Gruppenlabels: dezent, mit mehr Abstand; Trennlinien nur im Fußbereich
- Badges: klein, konturiert statt gefüllt-rot
- Schatten/Border: sehr feine Kante statt harter Border

Wirkung: freundlich-professionell, leicht, gut für viel Lesen (Chat, Verträge).

### Variante C — „Puristisch"

Sidebar fast ohne eigenen Hintergrund (nahtlos mit dem Inhalt), Navigation als
kompakte Pills.

- Aktiver Punkt: dunkle Pill (fast schwarz) mit weißem Text — kräftiger Kontrast
- Icons: minimal, einheitlich, ohne Farbakzente außer im aktiven Zustand
- Sehr dichte, ruhige Liste; Gruppenlabels nur beim Admin
- Badges: schlichte Zahl in Grau, roter Punkt nur bei Chat

Wirkung: modern, reduziert, am wenigsten „klassisches Admin".

## In allen Varianten gleich

- Gleiche Menüpunkte und Reihenfolge wie heute — keine Inhalte werden umgebaut
- Einklappen auf Icon-Leiste funktioniert weiter (Admin automatisch, Mitarbeiter über Knopf)
- Gesperrte Punkte (Mitarbeiter ohne Freischaltung) bleiben erkennbar, aber dezent
- Mobile: Bottom-Navigation im Mitarbeiter-Portal übernimmt die neue Bildsprache
- Dark Mode: eigene, abgestimmte Werte für beide Modi

## Technische Umsetzung (nach Wahl)

1. Neue Sidebar-Tokens in `src/styles.css` (hell + dunkel), Aktiv-Stil über Tokens
2. `AdminLayout.tsx`: Klassen für Aktiv-Zustand, Icons, Labels, Badges anpassen
3. `EmployeeLayout.tsx`: dieselben Muster; Mobile-Bottom-Nav mitziehen lassen
4. Prüfung: Typecheck grün, beide Layouts im Browser gegensehen (Hell + Dunkel)

## Offen / zu entscheiden

- Welche Variante (A, B oder C)?
- Optional: soll der Kopf („Admin Panel"-Zeile) mit angefasst werden oder strikt nur die Sidebar?
