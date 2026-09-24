# Bewerbungsseite (/bewerbung) reparieren

## Was kaputt ist
- Überschriften („Bewerbung fortsetzen", „Willkommen …") sind unsichtbar: weiße Schrift auf weißer Karte.
- Die eingegebene E-Mail im Feld ist kaum lesbar.
- Die Karte sitzt nach rechts unten verschoben statt mittig.

## Ursache
Die Seite übernimmt Schriftfarben und Seitenaufteilung aus dem Portal-Design (dunkles Farbschema der Firma bzw. Portal-Rahmen). Überschriften und Eingabefeld haben keine eigene Farbe, und die Seite wird innerhalb eines Rahmens mit Platz für eine Seitenleiste angezeigt.

## Umsetzung
1. Alle Texte der Bewerbungskarte bekommen feste, gut lesbare Farben (dunkle Überschrift, graue Erklärtexte) – in allen Zuständen: E-Mail-Eingabe, Laden, Willkommen, ungültiger Link.
2. Eingabefeld mit weißem Hintergrund, dunkler Schrift und sichtbarem Platzhalter.
3. Die Seite füllt den ganzen Bildschirm und zentriert die Karte, unabhängig vom umgebenden Portal-Rahmen.
4. Prüfen, ob das Interview (/bewerbung/…) dasselbe Problem hat, und dort gleich mitbeheben.
5. Kontrolle per Screenshot im hellen und dunklen Farbschema.

## Technische Details
- `src/routes/bewerbung.index.tsx`: explizite `text-slate-900`/`text-slate-600` statt geerbter `foreground`/`muted-foreground`; Input `bg-white text-slate-900 placeholder:text-slate-400`; Wrapper `fixed inset-0 overflow-auto` bzw. prüfen, welcher Layout-Wrapper in `__root.tsx` den Versatz erzeugt, und `/bewerbung` davon ausnehmen.
