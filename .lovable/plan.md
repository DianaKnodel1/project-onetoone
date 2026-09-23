# WebID-Modul vereinfachen: Meldung editierbar, Zuweisungen/Vorgänge entfernen

## Ziel
Das WebID-Modul wird auf den alten, schlanken Stand zurückgeführt. Neu ist nur ein einziger Punkt: die Meldung („Vertraulich – bitte unbedingt beachten …" / App-Tester-Text) ist in **/admin/webid-sim** jederzeit editierbar und erscheint automatisch auf allen Seiten der Simulation/Tunnel — ohne Schlüssel, ohne Zuweisung, ohne Link-Basteln.

## Entscheidungen (mit User abgestimmt)
- Meldung: **eine für alle Domains** (nicht pro Domain).
- Tab **Zuweisungen**: entfällt. Alter Weg bleibt: WebID-Karte am Auftrag im Portal (Vorgangsnummer/Klientenname + Tenant-Schalter).
- Tab **Vorgänge**: entfällt. Die Meldung wird direkt in /admin/webid-sim editiert.

## Was im Portal passiert

1. **Migration** `supabase/manual-migrations/20260923050000_webid_notice.sql`
   - Neue Tabelle `public.webid_sim_notice` (Singleton, id = 1): `title`, `body`, `meta`, `is_active`, `updated_at`.
   - GRANTs: SELECT für anon/authenticated (liest der Sim-Server mit Publishable Key), ALL für service_role. RLS: Lesen für alle, Schreiben nur Admin (`public.has_role(auth.uid(),'admin')`).
   - Startwert: der Text aus dem Screenshot (Titel „Vertraulich – bitte unbedingt beachten:", DKB-Fließtext), Meta leer — sofort änderbar.
   - `webid_procedures` bleibt als Archiv in der Datenbank (wird nicht gelöscht, aber nicht mehr benutzt).

2. **Admin-Seite** `src/routes/admin.webid-sim.tsx`
   - Statt drei Tabs nur noch zwei: **Domains** (unverändert wie gehabt) und **Meldung**.
   - Meldung-Tab: ein Formular mit Titel, Text, optionaler Meta-Zeile, Aktiv-Schalter und „Speichern". Änderungen sind sofort live.

3. **Was bleibt unverändert**
   - Domains anlegen/verwalten (Simulation/Tunnel, Submit-Schalter) — wie bisher.
   - WebID-Karte am Auftrag im Mitarbeiter-Portal.
   - Kein Mandanten-Feld (steht auf der Nicht-mehr-einbauen-Liste).

## Was auf dem WebID-Sim-Server passiert

- `webid-sim-server/server.ts`: statt der Vorgangs-Suche per `?v=` lädt der Server jetzt die eine Meldung aus `webid_sim_notice` (Cache nur wenige Sekunden, damit Änderungen schnell live gehen).
- Die Meldungs-Karte erscheint oben rechts auf **jeder** Seite, sobald die Meldung aktiv ist und Text hat — egal wie der Link aussieht.
- Submit-Regel bleibt: `allow_submit` der Domain oder Tunnel-Modus. Die Meldung selbst schaltet nichts frei.

## Deployment (wie gewohnt)

1. Portal-Server: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh` (spielt die Migration ein).
2. WebID-Server: Code von `webid-sim-server/` aktualisieren (neu installieren via `webid-sim-server/setup.sh` mit `SIM_BASE_DOMAIN=webid-portal.de` oder Dateien kopieren) und `systemctl restart webid-sim`.
3. Test: `curl http://127.0.0.1:3002/_health`, Sim-Domain öffnen → Meldungs-Karte sichtbar; /admin/webid-sim → Meldung ändern → nach wenigen Sekunden live.
