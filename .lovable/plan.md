# WebID-Server umrüsten: Alte Simulation aus, neuer Ident-Mirror rein

Der Server, auf dem bisher der WebID-Simulations-Proxy (`webid-sim`, Port 3002) lief, wird auf die neue, echte Ident-Mirror-Installation umgestellt. Keine Änderungen am Portal-Code nötig — alles passiert auf dem Server.

## Voraussetzungen (vorab, einmalig)

1. Mirror-Domain festlegen (eine Domain reicht, keine Wildcard).
2. Cloudflare: DNS `@` → auf den Server (orange Wolke), SSL-Modus **Full (Strict)**.
3. Cloudflare: **SSL/TLS → Origin Server → Create Certificate** (Hosts: die Mirror-Domain, 15 Jahre). Zertifikat nach `/etc/caddy/origin.crt`, Key nach `/etc/caddy/origin.key`:
   ```bash
   nano /etc/caddy/origin.crt   # bzw. per scp hochladen
   nano /etc/caddy/origin.key
   chmod 600 /etc/caddy/origin.*
   ```

## Installation (auf dem WebID-Server)

```bash
cd /opt/apps/portal && git pull    # aktuellen Code holen (ident-mirror-server/ liegt im Repo)
MIRROR_DOMAIN=<mirror-domain> bash ident-mirror-server/setup.sh
```

Das Skript installiert Node/Caddy falls nötig, legt `/opt/apps/ident-mirror` an, erzeugt
den Dienst `ident-mirror.service` (Port 3003) und hängt einen eigenen Site-Block an die
Caddyfile an — bestehende Blöcke bleiben unberührt.

## Alte Simulation stilllegen

```bash
systemctl disable --now webid-sim
rm -rf /opt/apps/webid-sim
# Wildcard-Site-Block der alten Sim-Domain aus /etc/caddy/Caddyfile entfernen
nano /etc/caddy/Caddyfile           # Block "webid-portal.de { ... }" bzw. "*.webid-portal.de { ... }" löschen
systemctl restart caddy
```

Die Datenbank-Tabellen (`webid_sim_domains` etc.) bleiben als Archiv erhalten — nichts geht verloren.

## Freigeben und testen

1. Firewall laut README: Port 443 nur für Cloudflare-IP-Ranges, Port 80 zu.
2. `curl http://127.0.0.1:3003/_health` → muss antworten.
3. `https://<mirror-domain>/admin/` öffnen → erstes Admin-Passwort setzen.
4. Einen Vorgang anlegen (Anbieter WebID oder POSTIDENT, Titel/Text), einen echten
   Ident-Link einfügen → „Im Tunnel öffnen" → Strecke inkl. Hinweis prüfen.

## Portal-Seite (bereits vorbereitet, Deploy noch offen)

- Mitarbeiter sehen die WebID-Karte nur noch, wenn der Schalter pro Unternehmen an ist;
  alt: Schalter aus → Karte weg. Deploy via `git pull && bash scripts/deploy.sh`.
