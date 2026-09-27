# Audit: Anmeldung, Registrierung und Bewerber-Weg

Ziel: Jede Stelle finden, an der ein Bewerber zwischen Bewerbung und Portal hängen bleiben kann, und sie beheben, bevor es weitere Leads kostet.

## 1. Durchgehender Test (so wie ein echter Bewerber)
Mit einem frischen Test-Konto, auf Handy-Größe und am Computer:
- Bewerbung über eine Generator-Seite abschicken, Termin auswählen
- Zusage-Link öffnen, vorausgefüllte Registrierung abschließen
- Erste Anmeldung, Onboarding, erster Portal-Aufruf, Auftrag ansehen
- Abmelden, erneut anmelden, Passwort vergessen/zurücksetzen
- Sonderfälle: gleiche E-Mail zweimal, Großbuchstaben/Leerzeichen in der E-Mail, falsches Passwort, abgebrochene Registrierung wieder aufnehmen, alter Link, Seite neu laden mitten im Ablauf

## 2. Code-Prüfung aller Stellen, die abbrechen können
- Registrierung, Anmeldung, Passwort vergessen, Einladung/Zusage-Link, Onboarding
- Die vier Anmelde-Funktionen auf dem Datenbank-Server (Sperren, Firmen-Zuordnung, Doppel-Konten)
- Rechte in der Datenbank: kann ein neues Konto sofort sein Profil, seine Firma und die Aufträge lesen?
- Übrig gebliebene Mail-Prüfungen oder alte Sperrlisten
- Jede Fehlermeldung: verständlich auf Deutsch statt „Something went wrong" / technischer Satz

## 3. Frühwarnung, damit Sie es vor dem Bewerber merken
- Jede fehlgeschlagene Registrierung oder Anmeldung wird mit Uhrzeit, E-Mail, Firmenseite und genauem Grund gespeichert
- Neue Übersicht im Admin-Bereich: „Anmelde-Probleme" (letzte 7 Tage), damit Sie betroffene Bewerber direkt anrufen können

## 4. Ergebnis
- Kurzer Bericht: was geprüft, was gefunden, was behoben
- Liste der Dinge, die nur auf Ihrem Server geprüft werden können, mit fertigen Befehlen

## Technische Details
- Test per Playwright gegen die Vorschau; für echte Konten brauche ich ein Test-Konto auf Ihrem Server (api.mb-portal.com) bzw. Sie führen die Server-Tests mit meinen Befehlen aus
- Geprüfte Dateien u. a.: register.tsx, login.tsx, reset-password, Invite-Route, Onboarding, router.tsx, supabase/functions/send-signup-confirmation, RLS-Policies auf profiles/tenants/Aufträge
- Neue Tabelle auth_failure_log (mit GRANTs + RLS nur Admin via has_role) plus Migration; Protokollierung in Edge Function und Client-Fehlerpfaden
- Kein Umbau der bestehenden Struktur
