# Deckblätter direkt im Chat: Landing-Generator + Login & Status

## Ziel
Zwei vollständige, gut gegliederte Anleitungen („Deckblätter"), die direkt hier im Chat erscheinen und zum Weiterschicken an den Kollegen gedacht sind. Kein Code, keine App-Änderung.

## Deckblatt 1 — Landing-Generator
1. Was der Generator macht (eigene Domain, Hosting Server 1, SSL automatisch; Weg: Bewerbung → Calendly-Termin → Mitarbeiterportal).
2. Oberfläche: Kopfzeile, Liste der gespeicherten Landings (Domain, Slug, Theme, Flow, Setup-Prüfung, Status live/pausiert), Aktionen Bearbeiten / Als Vorlage verwenden / Aktivieren-Pausieren / Löschen (Termine bleiben erhalten).
3. Schritt 1 — Theme wählen: alle Vorlagen sind „direkt" (kein Fast-Track/Vermittlung mehr bei neuen Seiten); „Eigene Vorlage" aus dem Baukasten lädt direkt im Generator; „Gespeicherte Baukasten-Seiten verwenden" = Kopie.
4. Schritt 2 — Branding & Inhalte: Pflichtfelder (Firmenname, Kontakt-E-Mail, Landing-Domain, API-Endpoint, Tenant-ID, Portal-URL), optionale Felder (Logo, Favicon, Farben, WhatsApp, Adresse, Impressums-Daten, Tracking-Slug, Meta-Pixel), KI-Bewerbungsgespräch (Chat/Telefon/Beides, Stimme, Profilbild, eigener System-Prompt), Terminbuchung über Calendly.
5. Schritt 2b — Theme-Inhalte (Slots je Vorlage).
6. Schritt 2c — SEO & Browser-Tab (Seitentitel, Meta-Beschreibung, OG-Bild).
7. Schritt 3 — Speichern & live schalten (Slug, Speichern, ZIP-Backup, Impressums-Prüfung, DNS-Anleitung A-Record + Cloudflare).
8. Live-Vorschau rechts (sofort, „In neuem Tab öffnen").
9. Checkliste: neue Seite von null bis live.
10. Häufige Fehler & Tipps.

## Deckblatt 2 — Login & Status
1. Anmeldeseite: E-Mail + Passwort, Fehlermeldungen und ihre Bedeutung (falsche Zugangsdaten, nicht bestätigtes Konto → Neu-Registrierung, deaktivierter Zugang, Sperr-Sperre zeigt bewusst „E-Mail oder Passwort ist falsch", Server-Antwortet-nicht-Hinweis).
2. Who-goes-where nach Login: Admin → /admin, admin_mitarbeiter → /admin/tasks, alle anderen → /dashboard.
3. Mandanten-Prüfung: Nicht-Admins müssen sich über die Unternehmensseite (Tenant) anmelden, sonst Abbruch.
4. Registrierung: nur über Einladungs-Link, E-Mail-Verifikation deaktiviert, Konto-Halbannahme-Fall (erneut registrieren), Support über WhatsApp/E-Mail bei Problemen (kein automatischer Mailversand).
5. Status-System im Portal: Mitarbeiter-Status (Registriert → Angenommen, Abgelehnt, Deaktiviert) mit Bedeutung und Freischalt-Logik; KYC-Status (Nicht gestartet → Eingereicht → In Prüfung → Verifiziert/Abgelehnt); Onboarding-Status (Nicht gestartet / In Bearbeitung / Abgeschlossen) — Onboarding ist verpflichtend, kann im Admin-Profil per „Onboarding überspringen" manuell abgeschlossen werden.
6. Auftrags-Status (Entwurf → Zugewiesen → Geplant → In Bearbeitung → Eingereicht → In Prüfung → Genehmigt/Abgelehnt/Nachbesserung → Abgeschlossen).
7. Auszahlungs-Status (Ausstehend → Gutgeschrieben → Genehmigt → Ausgezahlt).
8. Häufige Fehler & was der Kollege dann tun kann.

## Vorgehen
- Beide Anleitungen als je eine Markdown-Nachricht im Chat senden (Titel, 8–12 Abschnitte, kompakt aber vollständig).
