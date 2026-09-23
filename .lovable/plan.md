# WebID-Modul auf eigenem Server aufsetzen

## Was das Modul ist

Das WebID-Modul besteht aus zwei Teilen:

- **Simulations-Proxy (kommt auf den neuen Server):** Ein schlanker Node.js-Dienst (`webid-sim-server/`), der die WebID-Seite 1:1 durchreicht und fest eingeblendete Simulations-Kennzeichnungen darüberlegt (obere Leiste, Hinweis-Popup, `[SIMULATION]` im Titel). Echte Absendungen an WebID sind standardmäßig blockiert.
- **Verwaltung (bleibt im bestehenden Portal):** Domains und Schalter werden weiterhin im Admin-Bereich gepflegt (`/admin/webid-sim`, Schalter pro Unternehmen unter Domains/Tenants). Die Daten liegen in der bestehenden Datenbank — der neue Server liest daraus nur die Domain-Liste.

Es muss also **kein zweites Portal** installiert werden. Der neue Server braucht nur lesenden Zugriff auf die bestehende Datenbank (öffentlicher Schlüssel, nur aktive Simulations-Domains sichtbar).

## Server-Empfehlung

**KVM-VPS**, kein Docker-VPS:

- 2 vCPU, 2 GB RAM, 20 GB SSD (mehr ist nicht nötig — es läuft nur ein kleiner Proxy)
- Ubuntu 24.04
- Standort Deutschland/EU
- Kein Docker nötig — der Dienst läuft direkt als Systemdienst mit automatischem Neustart

## Voraussetzungen (vor der Installation)

1. **Domain für die Simulations-Umgebung** (z. B. `webid-portal.de` oder eine neue Domain des Kunden), verwaltet in **Cloudflare** (kostenlos).
2. In Cloudflare:
   - SSL/TLS → Origin Server → Zertifikat erstellen (Hosts: `domain.tld` und `*.domain.tld`, 15 Jahre)
   - SSL-Modus auf **Full (Strict)**
   - DNS: `@` und `*` auf die neue Server-IP, **orange Wolke** (Proxy an)
3. Zugangsdaten der bestehenden Datenbank: `SUPABASE_URL` (api.mb-portal.com) und der öffentliche Schlüssel (anon key).

## Umsetzungsschritte

1. **Setup-Skript anpassen** (`webid-sim-server/setup.sh`): kleine Prüfung, dass es auf einem frischen Ubuntu 24.04 sauber durchläuft; Firewall-Teil mit aktuellen Cloudflare-IP-Bereichen ergänzen (`scripts/update-cloudflare-ips.sh` wiederverwenden).
2. **Installations-Anleitung als fertige Befehlsfolge** für den neuen Server:
   ```bash
   git clone https://github.com/DianaKnodel1/project-onetoone.git /tmp/portal
   cd /tmp/portal
   SUPABASE_URL=https://api.mb-portal.com \
   SUPABASE_PUBLISHABLE_KEY=<anon-key> \
   SIM_BASE_DOMAIN=<sim-domain.tld> \
   bash webid-sim-server/setup.sh
   ```
   Danach Cloudflare-Zertifikat nach `/etc/caddy/origin.crt` / `origin.key` legen, `systemctl restart caddy`.
3. **Firewall:** Port 22 offen, Port 443 nur für Cloudflare-IP-Bereiche, Port 80 zu — Origin-IP bleibt verborgen.
4. **Test auf dem Server:** `curl http://127.0.0.1:3002/_health`, dann eine Test-Domain im Admin-Bereich unter „WebID-Sim" anlegen und die Seite über die Sim-Domain aufrufen (Simulations-Leiste muss sichtbar sein).
5. **Modul für den Kunden aktivieren:** im Admin unter Domains/Tenants den WebID-Schalter für das betreffende Unternehmen einschalten (`webid_enabled`), damit die WebID-Station in den Aufträgen erscheint.

## Nicht Teil davon

- Kein zweites Portal, keine zweite Datenbank, kein Umzug bestehender Dienste
- Keine echte WebID-Anbindung — es bleibt die Simulations-/Schulungsumgebung mit den vorhandenen Sicherheitsleitplanken (keine echten Absendungen, Whitelist-Pfade, Rate-Limit, noindex)

## Technische Details

- Dienst: Node.js (aus `webid-sim-server/server.ts` gebaut), Port 3002 auf 127.0.0.1, davor Caddy auf 443 mit Cloudflare-Origin-Zertifikat
- Datenbankzugriff: nur `SELECT` auf `public.webid_sim_domains` via anon key + RLS (Policy `webid_sim_domains_anon_read_active`) — Migration `20260731000000_webid_sim_domains.sql` ist auf api.mb-portal.com bereits angewendet
- Datenfluss: Besucher → Cloudflare → Caddy :443 → Node-Proxy :3002 → webid-gateway.de; HTML wird gestreamt, Overlay server-seitig injiziert
