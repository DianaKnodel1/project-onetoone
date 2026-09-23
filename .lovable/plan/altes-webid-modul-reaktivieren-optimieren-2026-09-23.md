# Altes WebID-Modul reaktivieren + optimieren

Sie verwalten alles im Admin-Portal — Ihr Kunde bekommt keinen eigenen Zugang. Pro Sim-Domain wählbar: **Simulation** (Overlay wie bisher) oder **echter Tunnel** (Mirror wie im Ident-Mirror). Mitarbeiter-Karte wird wieder eingeblendet, Hinweis-Texte pro Vorgang einstellbar.

## Was zurückkommt

1. **Admin-Menü „WebID-Simulation"** wieder sichtbar; Route `admin.webid-sim.tsx` wieder aktiv (aus früherem Löschen wiederherstellen).
2. **WebIdTaskCard im Mitarbeiter-Auftrag** wieder eingebunden (nur wenn Tenant-Schalter `webid_enabled` an).
3. **Simulations-Server** (`webid-sim-server/`) läuft wieder auf dem WebID-Server (Port 3002) — der Ident-Mirror auf 3003 bleibt daneben aktiv (parallel).

## Was neu / optimiert wird

**Pro Sim-Domain: Modus wählbar.** Neue Spalte `mode` (`simulation` | `tunnel`) in `webid_sim_domains`:
- `simulation` (Default): heutiges Verhalten — Overlay, Submits blockiert.
- `tunnel`: echter Durchgang zu `target_origin`, Overlay-Hinweis bleibt oben, Submits durchgereicht wenn `allow_submit=true`.

**Hinweis-Texte pro Vorgang** (wie Ident-Mirror). Neue Tabelle `webid_procedures`:
- `key`, `label`, `provider` (`webid` | `postident`), `title`, `text`, `meta`, `allow_submit`, `is_active`.
- Zuweisung pro Auftrag: neue Spalte `task_assignments.webid_procedure_key` (Dropdown im Admin).
- Der Mitarbeiter sieht Titel/Text als Karte, bevor er auf „Weiter zu WebID" klickt.

**Admin-UI erweitert** (`/admin/webid-sim`, drei Tabs):
- **Domains** (bestehend): Sim-Domain anlegen, Ziel-Origin, `mode`, `allow_submit`, Aktiv-Schalter, Kunde/Mandant zuordnen (per `tenant_id`).
- **Vorgänge** (neu): CRUD auf `webid_procedures`.
- **Zuweisungen** (neu): Suche nach Vorgangsnummer/Mitarbeiter, Vorgang + Sim-Domain wählen, Link generieren, „Kopieren" / „Per WhatsApp senden".

**Server (`webid-sim-server/`) erweitert** — Modus je Domain berücksichtigen:
- `simulation` wie heute.
- `tunnel`: kein „SIMULATION"-Präfix im Titel, kein Sperr-Modal; nur die Hinweis-Karte des Vorgangs oben (per Query-Param `?v=<procedure_key>` gerendert). Submits durchgereicht wenn `allow_submit`.
- Rate-Limit, `X-Robots-Tag: noindex,nofollow`, keine Body-Logs bleiben.

## Datenbank-Migration (neu)

```sql
-- Modus pro Sim-Domain
ALTER TABLE public.webid_sim_domains
  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'simulation'
    CHECK (mode IN ('simulation','tunnel')),
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL;

-- Vorgänge / Hinweis-Texte
CREATE TABLE IF NOT EXISTS public.webid_procedures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL,
  provider text NOT NULL CHECK (provider IN ('webid','postident')),
  title text NOT NULL,
  body text NOT NULL,
  meta text,
  allow_submit boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.webid_procedures TO anon, authenticated;
GRANT ALL ON public.webid_procedures TO service_role;
ALTER TABLE public.webid_procedures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read procedures" ON public.webid_procedures FOR SELECT USING (true);
CREATE POLICY "admin manage procedures" ON public.webid_procedures
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Vorgang pro Auftrag
ALTER TABLE public.task_assignments
  ADD COLUMN IF NOT EXISTS webid_procedure_key text;
```

## Server-Umstellung

Auf dem WebID-Server (der jetzt den Ident-Mirror hat):
- Ident-Mirror bleibt auf 3003 (webid-portal.com).
- `webid-sim` wieder aktivieren:
  ```bash
  systemctl enable --now webid-sim
  ```
- Falls Ordner `/opt/apps/webid-sim` gelöscht: neu installieren via `webid-sim-server/setup.sh` mit `SIM_BASE_DOMAIN=webid-portal.de`.
- Caddyfile-Block für `*.webid-portal.de` wieder eintragen (Wildcard, Reverse-Proxy nach 127.0.0.1:3002).

## Deploy im Portal

- `scripts/deploy.sh`: `webid-sim-server` bleibt drin (nichts entfernen).
- Neue Migration `20260923040000_webid_mode_and_procedures.sql` wird beim Deploy automatisch mit eingespielt.

## Technische Details

| Was | Wo | Änderung |
|---|---|---|
| Admin-Route wiederherstellen | `src/routes/_authenticated/admin.webid-sim.tsx` | aus Git-History; drei Tabs |
| Mitarbeiter-Karte wieder rein | `src/routes/_employee/tasks.$assignmentId.tsx` | `WebIdTaskCard` importieren |
| Modus im Server | `webid-sim-server/server.ts` | `mode` aus DB, Overlay-Zweig |
| Vorgangs-Hinweis | `webid-sim-server/server.ts` | Query `?v=<key>` → Karte |
| Migration | `supabase/manual-migrations/20260923040000_webid_mode_and_procedures.sql` | neu |
| Deploy | `scripts/deploy.sh` | keine Änderung |

## Nicht Teil dieses Plans

- Kein eigener Login für Ihren Kunden.
- Der Ident-Mirror (webid-portal.com) bleibt als zweite, unabhängige Installation bestehen und wird nicht rückgebaut.
- Keine Änderungen an den echten Ident-Anbietern (WebID/POSTIDENT).
