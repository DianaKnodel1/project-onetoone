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
- Die Anmelde-Funktionen auf dem Datenbank-Server (Sperren, Firmen-Zuordnung, Doppel-Konten)
- Rechte in der Datenbank: kann ein neues Konto sofort sein Profil, seine Firma und die Aufträge lesen?
- Jede Fehlermeldung: verständlich auf Deutsch statt „Something went wrong" / technischer Satz

## 3. Reste des alten Mail-Systems aufspüren
- Jede Stelle, die noch Mail-Zugangsdaten, Mail-Bestätigung, Versand-Pausen oder alte Sperrlisten prüft und dadurch einen Bewerber blockieren kann
- Konten, die noch als „E-Mail nicht bestätigt" hängen und sich deshalb nicht anmelden können
- Alte Mail-Links oder Hinweise („Wir haben dir eine Mail geschickt"), die Bewerber verwirren

## 4. Ergebnis
- Bericht in einfachen Worten: wo, woran und weshalb Bewerber stecken bleiben
- Alles, was im Code behebbar ist, wird direkt behoben
- Fertige Befehle für die Dinge, die nur auf Ihrem Server geprüft oder behoben werden können (z. B. hängende Konten freischalten)

## Technische Details
- Playwright gegen die Vorschau; für echte Konten auf api.mb-portal.com liefere ich SQL-Prüfbefehle (z. B. auth.users ohne email_confirmed_at, Profile ohne tenant_id, Zusagen ohne Konto)
- Geprüft u. a.: register.tsx, login.tsx, Reset-/Invite-/Onboarding-Routen, AuthContext, router.tsx, EmployeeLayout, Edge Functions send-signup-confirmation/resend/invitation, RLS auf profiles/tenants/Aufträge, GoTrue-Einstellung „Autoconfirm"
- Keine neue Tabelle, kein Umbau der bestehenden Struktur
