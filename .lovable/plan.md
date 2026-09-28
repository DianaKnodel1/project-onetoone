# Mitarbeiter-Portal: Seiten-Springen und "Kurz hat etwas nicht geklappt" beheben

## Was die Bewerber sehen
1. Fehlerseite "Kurz hat etwas nicht geklappt" mit "cannot add postgres_changes callbacks for realtime:leader-presence-… after subscribe()".
2. Das Portal springt zwischen Übersicht, Vertrag, Ausweis und Chat hin und her; kurz blitzen Übersicht und Einführungs-Tour ("Schritt 1 von 15") auf, dann erscheint wieder "Laden…".

## Ursachen (im Code bestätigt)
1. **Absturz:** Die Teamleiter-Anzeige wird gleichzeitig an mehreren Stellen geladen (Teamleiter-Kasten oben, schwebender Chat-Knopf, Chat-Seite). Alle melden sich unter demselben Live-Kanal-Namen an. Sobald die zweite Stelle erscheint, bricht die Seite ab. Das kam mit dem neuen Teamleiter-Kasten im Pflicht-Ablauf.
2. **Springen:** Zwei Weiterleitungsregeln widersprechen sich:
   - Regel A (alt): Wer noch nicht freigegeben ist und eine nicht erlaubte Seite öffnet (z. B. Chat, Aufträge), wird auf die Übersicht geschickt.
   - Regel B (neu): Wer den Pflicht-Ablauf nicht fertig hat, wird zu Vertrag/Ausweis/Einführung geschickt, der Chat ist ausdrücklich erlaubt.
   - Ergebnis: Chat → Übersicht → Vertrag … Auf der Übersicht startet dabei kurz die Einführungs-Tour, dann wird weitergeleitet.

## Änderungen
1. Teamleiter-Anzeige: jede Stelle bekommt einen eigenen Live-Kanal-Namen. Die Anzeige bleibt gleich.
2. Weiterleitung vereinheitlichen:
   - "/chat" kommt in die Liste der immer erlaubten Seiten.
   - Solange der Pflicht-Ablauf offen ist, greift nur Regel B. Regel A schickt dann nicht mehr zusätzlich auf die Übersicht.
   - Die Einführungs-Tour auf der Übersicht startet erst, wenn der Pflicht-Ablauf abgeschlossen ist.
3. Sonst keine Änderungen an Design oder Abläufen.

## Prüfung
Mit einem Test-Konto im Browser durchspielen: Registrierung → Vertrag → Ausweis → Einführung → Übersicht. Dabei den Chat öffnen, ohne dass die Seite springt oder abstürzt.

## Technische Details
- `src/hooks/use-team-leader.ts`: Kanal-Name `leader-presence-${user.id}-${random}` (useRef/useId).
- `src/components/EmployeeLayout.tsx`: `/chat` in `ALWAYS_ALLOWED_PATHS`; im Effekt mit `navigate("/dashboard")` abbrechen, wenn `contractPending || kycOpen || !onboardingDone`.
- Die Dashboard-Tour wird nur gestartet, wenn der Ablauf fertig ist (Stelle im Dashboard ermitteln und absichern).
- Deploy: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`.
