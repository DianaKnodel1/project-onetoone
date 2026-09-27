# Neue Seiten im Landing-Baukasten speicherbar und auswählbar machen

## Ursache (im Code nachgesehen)
Eine neu erstellte Seite (über "Neue Seite", "Mit KI erstellen" oder "Seite duplizieren") wird beim Klick auf "Speichern" gar nicht gespeichert:
- Der Baukasten schickt für neue Seiten eine **leere Domain** mit.
- Beim Speichern ist aber eine Domain Pflicht (mind. 3 Zeichen, und jede Domain darf nur einmal vorkommen).
- Im Baukasten gibt es kein Feld, um eine Domain einzutragen.

Folge: Speichern schlägt fehl, die Seite landet nie in der Liste, und im Auswahlfeld "— Seite wählen —" erscheinen nur die alten Seiten. Genau das beschreibt Ihr Kollege.

Zusätzlich: Wenn "Als Vorlage speichern" nicht klappt oder die Vorlagen nicht geladen werden können, bleibt der Bereich "Aus eigener Vorlage" einfach unsichtbar, ohne Hinweis.

## Änderungen
1. **Domain-Feld in den Grundeinstellungen** des Baukastens (z. B. "firma-xyz.de"). Bestehende Seiten zeigen ihre Domain dort an.
2. **Speichern auch ohne Domain möglich**: Ist noch keine Domain eingetragen, wird automatisch ein eindeutiger Platzhalter vergeben (Seite bleibt offline). Die echte Domain kann später eingetragen werden.
3. **Klare Meldung** statt stillem Scheitern: Fehlt der Kurzname oder ist die Domain schon vergeben, sagt der Baukasten das verständlich.
4. **Eigene Vorlagen**: Können sie nicht geladen werden, erscheint bei "Neue Seite" ein kurzer Hinweis statt leerem Bereich.
5. Nach dem Speichern ist die neue Seite sofort im Auswahlfeld ausgewählt (ist bereits so vorgesehen, greift dann wieder).

Keine anderen Funktionen oder Design-Änderungen, keine Datenbank-Änderung.

## Technische Details
- `src/routes/admin.landing-baukasten.tsx`: State `domain` (aus `current.domain` in `applyState`), Eingabefeld in den Grundeinstellungen, im Payload `domain: domain.trim() || \`${slug}.entwurf.invalid\``; beim Duplizieren Domain leeren. Platzhalter-Domains in der Anzeige ausblenden.
- Duplikat-Prüfung gegen `landings` auch für Domain; Fehlermeldungen "duplicate key … domain" in verständlichen Text übersetzen.
- `refreshTemplates`: Fehler merken und im "Neue Seite"-Dialog als Hinweis zeigen (z. B. fehlende Migration `20260923000000_landing_templates.sql`).
- Deploy danach: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`.
