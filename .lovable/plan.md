# Gespeicherte Baukasten-Vorlagen direkt in "1. Theme wählen" auswählbar

## Ziel
Im klassischen Generator stehen Ihre gespeicherten Vorlagen (z. B. "Meine Vorlage", "Vorlage BHV Agentur UG") **direkt in der Theme-Liste** (roter Bereich im Screenshot), sehen aus wie die anderen Themes und lassen sich genauso anklicken. Ein Klick wählt sie aus: Die Live-Vorschau rechts zeigt sofort die Vorlage mit Ihrem Branding, und "Speichern & live schalten" legt die neue Landingpage auf Basis dieser Vorlage an. Kein Sprung in den Baukasten mehr.

## Was sich ändert
1. In der Theme-Liste erscheinen die eigenen Vorlagen als weitere Karten (Name, Beschreibung, kleines Kennzeichen "Eigene Vorlage"), unabhängig vom Filter "Partner-Firma/Vermittlung".
2. Klick auf eine Vorlage markiert sie (Haken wie bei Themes). Klick auf ein normales Theme hebt die Auswahl wieder auf.
3. Vorschau rechts zeigt die Vorlage mit Firmenname, Farben, Logo und Kontaktdaten aus Schritt 2.
4. Beim Speichern wird die Seite mit den Abschnitten der Vorlage angelegt; Domain, Branding, Impressum, Termin-Einstellungen usw. kommen wie gewohnt aus dem Generator-Formular. Die Vorlage selbst bleibt unverändert.
5. Die bisherigen Bereiche "Eigene gespeicherte Vorlagen" (Links in den Baukasten) darunter entfallen, da doppelt. "Gespeicherte Baukasten-Seiten verwenden" bleibt.

Sonst keine Änderungen an Generator, Baukasten, Design oder Datenbank.

## Technische Details
- `src/routes/admin.landing-generator.tsx`: State `templateId`; Vorlagen-Karten im gleichen Button-Stil innerhalb des Theme-Grids; `selectTheme` setzt `templateId=null`.
- Vorschau: bei gewählter Vorlage `renderSectionsPreview` (wie Baukasten) mit Sections der Vorlage + `branding` inkl. `style` der Vorlage statt Theme-Rendering.
- `handleSaveLive`: bei gewählter Vorlage `sections` (neue `sec_`-IDs) und `branding.style` mitsenden, `theme_id` = aktuelles Theme als Fallback. Ohne Vorlage bleibt der Payload exakt wie bisher (kein `sections`-Feld).
- AGENTS.md-Regel anpassen: Generator kann gespeicherte Section-Vorlagen direkt auswählen.
- Deploy: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`.
