# SIM-Modul aufräumen + Mitarbeiter sperren

Zwei Themen: das SIM-/SMS-Modul komplett prüfen und übersichtlich machen, und eine echte Sperre für Mitarbeiter.

## Teil 1 — SIM-Modul (Anosim)

### Was heute schon da ist
Nummern anlegen (mit API-Key), Abruf bei Anosim, Zuweisung an Mitarbeiter, Nachrichtenliste im Admin, SMS-Seite für Mitarbeiter. Der Aufbau ist aber unübersichtlich (drei getrennte Reiter) und der Abruf wird nur auf Knopfdruck ausgelöst.

### Neuer Aufbau der Admin-Seite
Statt drei Reitern eine Ansicht: links die Liste der Nummern, rechts die Nachrichten der gewählten Nummer.

Pro Nummer direkt sichtbar und bedienbar:
- Rufnummer, Bezeichnung, Anbieter, Verbindungsstatus (API-Key vorhanden / Test-Ergebnis)
- Wem die Nummer aktuell zugewiesen ist
- Knöpfe: „Mitarbeiter zuweisen", „Zuweisung entziehen", „Nummer aktiv/inaktiv", „Löschen"
- Nachrichtenliste mit Zeitpunkt, Absender und Text; erkannte Codes werden hervorgehoben

Neue Nummer hinzufügen bleibt ein kurzer Dialog (Nummer, Bezeichnung, API-Key) mit sofortigem Verbindungstest, damit ein falscher Key direkt auffällt statt still zu scheitern.

### Automatischer Abruf
Admin-Ansicht und Mitarbeiter-SMS-Seite holen alle 15 Sekunden selbstständig neue Nachrichten, solange die Seite offen ist. Der Knopf „Aktualisieren" bleibt zusätzlich. Der bestehende Cron-Abruf auf dem Server läuft unverändert weiter.

### Sichtbarkeitsregel für Mitarbeiter
Wie gewünscht: ein Mitarbeiter sieht ausschließlich Nachrichten, die **nach** seiner Zuweisung eingegangen sind, und nur solange die Zuweisung aktiv ist. Wird die Nummer entzogen, verschwinden die Nachrichten sofort aus seiner Ansicht. Ältere Codes aus der Zeit davor bleiben ihm verborgen.

### Komplettprüfung
Vor der Umsetzung der Optik wird die Kette durchgeprüft: Abruf bei Anosim (Antwortformat, Fehlermeldungen), Zuordnung Nummer → Kanal, Speichern ohne Doppelte, Zuweisungslogik, Anzeige beim Mitarbeiter. Gefundene Fehler werden behoben und im Ergebnis benannt.

## Teil 2 — Mitarbeiter sperren

- Neuer Schalter „Sperren" / „Freigeben" in der Mitarbeiterliste und direkt im Chat — unabhängig vom bisherigen Status, der Status bleibt erhalten.
- Gesperrte Mitarbeiter sind überall rot gekennzeichnet: Name durchgestrichen, rotes Kennzeichen „Gesperrt" (Mitarbeiterliste, Chat-Liste, Chat-Kopf, Auswahllisten).
- Der Mitarbeiter merkt nichts: beim Login-Versuch erscheint die normale Meldung „E-Mail oder Passwort ist falsch". Eine laufende Sitzung wird beim Sperren beendet.
- Registrierung mit derselben E-Mail ist ebenfalls nicht mehr möglich — gleiche neutrale Meldung.
- Gesperrte Mitarbeiter erscheinen nicht mehr in Zuweisungslisten (Aufträge, SMS-Nummern) und verlieren den Zugriff auf zugewiesene SMS.

## Technische Umsetzung

**Datenbank (neue Migration, manuell einzuspielen)**
- `profiles`: Spalten `is_blocked boolean not null default false`, `blocked_at timestamptz`, `blocked_by uuid`.
- SELECT-Policy auf `sms_messages` neu: zusätzlich `sms_messages.created_at >= a.assigned_at` und Ausschluss gesperrter Profile.
- `get_my_sms_assignments` bleibt; Mitarbeiter-Abfrage filtert Nachrichten zusätzlich über `assigned_at`.
- Policies, die Mitarbeiterdaten liefern, prüfen `is_blocked = false`.

**Server**
- Neue Serverfunktion `setEmployeeBlocked` (Admin-geprüft): setzt Flag, schreibt `activity_log`, beendet die Sitzung über die Auth-Admin-API.
- Login (`src/routes/login.tsx`) und Registrierung (`src/routes/register.tsx`): nach erfolgreicher Anmeldung Sperrprüfung → `signOut()` + generische Fehlermeldung; bei Registrierung Prüfung der E-Mail gegen gesperrte Profile über eine schlanke Serverfunktion.
- `src/lib/sms-poll.functions.ts`: Fehlerbehandlung und Nummernabgleich prüfen, Ergebniszählung korrigieren (aktuell wird jeder Treffer als „eingefügt" gezählt, auch Doppelte).

**Frontend**
- `src/routes/admin.sms.tsx` neu strukturiert (Zwei-Spalten, Zuweisung inline, Auto-Refresh, Code-Hervorhebung).
- `src/routes/_employee/sms.tsx`: Auto-Refresh, Filter nach `assigned_at`, klare Code-Darstellung.
- `src/lib/employee-utils.ts`: gesperrte Profile aus zuweisbaren Listen ausschließen.
- Gemeinsame Kennzeichnung (durchgestrichen + rotes Badge) in Mitarbeiterliste, `admin.chat.tsx` und Chat-Komponenten.

**Prüfung**
Typprüfung, Renderer-/Seitenchecks im Browser, Abruf-Test gegen Anosim über die Test-Funktion. Migration muss danach auf dem eigenen Server eingespielt werden (`bash scripts/migrate.sh`), dann Deploy.
