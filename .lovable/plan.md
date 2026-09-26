# Zwei Registrierungs-Fehler beheben

## Fehler 1: „Diese E-Mail-Adresse ist gesperrt“ (neu, nicht der von gestern)
Der SMTP-Fehler von gestern ist weg. Diese Meldung kommt von einer alten Sperrliste für Mail-Rückläufer (Adressen, an die früher Mails nicht zustellbar waren). Da das Portal keine Mails mehr verschickt, ist diese Sperre sinnlos und blockiert echte Bewerber.

**Änderung:**
- Die Rückläufer-Sperre wird aus der Registrierung entfernt. Nur noch echte Sperren bleiben: Mitarbeiter-Sperre durch Sie (Sim-Modul), deaktivierte Firma, „bereits registriert“.
- Einmaliger Befehl für den Datenbank-Server, der die alten Rückläufer-Sperren leert – damit der Bewerber sich sofort registrieren kann.

## Fehler 2: „Something went wrong“ direkt nach der Registrierung
Das Konto wird angelegt, aber der erste Bildschirm im Mitarbeiterbereich stürzt ab (oben sichtbar ist noch der Hinweis „Jetzt nachreichen“ – also ist der Mitarbeiterbereich schon geladen). Die genaue Ursache ist noch nicht bestätigt.

**Vorgehen:**
1. Mit einem frischen Test-Konto den Ablauf Registrierung → erster Bildschirm nachstellen und die genaue Absturzstelle finden.
2. Die Stelle absichern, sodass fehlende Daten eines neuen Kontos (z. B. noch keine Lohndaten, kein Team, keine Aufträge) nicht mehr zum Absturz führen.
3. Statt der englischen Absturzseite erscheint künftig eine deutsche Meldung mit „Neu laden“.

## Danach
- Portal-Update + Anmelde-Funktion neu einspielen (Befehle bekommen Sie fertig).
- Beide Bewerber bitten, sich neu anzumelden bzw. zu registrieren.

## Technische Details
- `supabase/functions/send-signup-confirmation/index.ts` Z. 80–99: Suppression-/Bounce-Check (suppressed_emails, email_recipient_failures, email_status) entfernen.
- SQL: `delete from suppressed_emails; update email_recipient_failures set suppressed_at=null; update profiles set email_status='active' where email_status<>'active'; update applications set email_status='active' where email_status<>'active';`
- Fehler 2: Repro mit Playwright gegen /register → EmployeeLayout (MissingPayrollDataBanner + Dashboard-Queries), Null-Guards ergänzen; Root-errorComponent auf Deutsch.
- Deploy: `bash scripts/deploy.sh` + `bash scripts/deploy-edge-function.sh send-signup-confirmation root@190.97.167.123 /opt/supabase/docker`.
