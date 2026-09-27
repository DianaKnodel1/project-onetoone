# Deckblatt/Kurz-Anleitung: Landing Generator (PDF)

## Ziel

Eine **einseitige, ansprechend gestaltete PDF-Anleitung** (A4, Deutsch) für den Kollegen:
Wie erstelle ich im Landing-Baukasten in wenigen Minuten eine neue, komplett eigene Landing-Page und schalte sie live?

Ablage: `/mnt/documents/landing-generator-anleitung.pdf`

## Inhalt der Anleitung (eine Seite, kompakt)

Kopf: Titel „Landing Generator — Neue Seite in Minuten", Untertitel, Kurz-Leitsatz (KI macht Texte, Design und Bilder; Bewerbungsformular, Terminbuchung und Portal-Übergang sind fest verdrahtet und können nichts kaputt machen).

Schritte als nummerierte, klar gestaltete Liste:

1. **Öffnen:** Im Portal unter Admin → „Landing-Baukasten". Nur Admins kommen rein.
2. **Neue Seite:** Knopf „Neue Seite" → „Mit KI erstellen" (alternativ „Leer starten" oder „Aus eigener Vorlage").
3. **Beschreiben:** Im Dialog Vorlage & Farbwelt wählen (Seriöser Dienstleister · Moderne Digital-Agentur · Kompakter Schnelleinstieg · Warm & persönlich), dann Firmenname, Stelle/Branche und 2–3 Stichworte (z. B. „16,50 €/Std., kein Lebenslauf nötig") → „Seite generieren" (dauert rund 20 Sekunden).
4. **Feinschliff im Editor:** Vorschau links, Abschnittsliste rechts. Abschnitte bearbeiten, verschieben (↑/↓), löschen, mit „+" neue einfügen. „Design neu würfeln" für neuen Look. Bilder: hochladen oder „Mit KI erzeugen". Ansicht Handy/Desktop umschalten und prüfen.
5. **Grundeinstellungen:** Firmenname, Kurzname (Slug), Haupt-/Akzentfarbe, Kontakt-E-Mail, Telefon, Calendly-Link, SEO-Titel und -Beschreibung.
6. **Speichern:** Knopf „Speichern". Optional: „Als Vorlage speichern" (wiederverwendbar) oder „Seite duplizieren" für die nächste Firma.
7. **Live schalten:** Seite im klassischen „Landing-Generator" öffnen (gleiche Liste), unter Branding die **Landing-Domain** eintragen (ohne https://) und speichern — damit ist die Seite online, das SSL-Zertifikat kommt automatisch. Voraussetzung: A-Record der Domain zeigt auf den Landing-Server.

Fußzeilen-Hinweise (kurz, 3 Punkte):
- Bestehende Live-Seiten bleiben unberührt — neue Seite = neuer eigener Auftritt.
- Bewerbungen landen immer in Admin → Bewerbungen; Bewerber sehen nach Zusage Logo & Name der Seite im Portal.
- Nach Tests im Portal: Seite einmal mit Strg+F5 neu laden.

Gestaltung: sauberes, professionelles A4-Layout passend zum Portal (ruhige Farbwelt, klare Typografie, nummerierte Schritte mit klarer Hierarchie, dezente Akzentfarbe für Knopf-Namen — Knopf-Namen wörtlich so, wie sie in der Oberfläche stehen).

## Umsetzung

- PDF mit ReportLab (platypus/canvas) bauen; DejaVu Sans registrieren für korrekte Umlaute.
- Ein einziges A4-Blatt; Schritte knapp formuliert, keine Textwüsten.
- QA laut PDF-Skill: mit pdftoppm rendern, visuell prüfen (Überlappungen, abgeschnittener Text, Ränder, Kontrast), ggf. iterativ nachbessern — erst dann liefern.

## Prüfungen

- pdftoppm-Renderung ansehen (kein Browser-QA).
- Bestätigen, dass alle Knopf-Namen und Felder exakt der echten Oberfläche entsprechen (Quelle: `src/routes/admin.landing-baukasten.tsx`, `admin.landing-generator.tsx`).
