# WebID-Server umrüsten: Alte Simulation aus, neuer Ident-Mirror rein

Der Server, auf dem bisher der WebID-Simulations-Proxy (`webid-sim`, Port 3002) lief, wird auf die neue, echte Ident-Mirror-Installation umgestellt. Keine Änderungen am Portal-Code nötig — alles passiert auf dem Server.

## Voraussetzungen — bereits erledigt

- Mirror-Domain: **webid-portal.com** (DNS in Cloudflare, orange Wolke, SSL-Modus **Full (Strict)**).
- Origin-Zertifikat liegt laut Server-Setup bereits vor: `/etc/caddy/origin.crt` + `/etc/caddy/origin.key`.
- Einmalig kurz prüfen, dass das Zertifikat für **webid-portal.com** ausgestellt wurde
  (Hosts beim Erstellen), nicht nur für die alte .de-Domain:
  ```bash
  openssl x509 -in /etc/caddy/origin.crt -noout -text | grep -A1 "Subject Alternative Name"
  ```
  Steht dort nur die alte .de-Domain, in Cloudflare ein neues Zertifikat mit Host
  `webid-portal.com` erzeugen und die beiden Dateien ersetzen — sonst schlägt der Browser-Handshake fehl.

## Installation (auf dem WebID-Server)

```bash
cd /opt/apps/portal && git pull    # aktuellen Code holen (ident-mirror-server/ liegt im Repo)
MIRROR_DOMAIN=webid-portal.com bash ident-mirror-server/setup.sh
```

Das Skript installiert Node/Caddy falls nötig, legt `/opt/apps/ident-mirror` an, erzeugt
den Dienst `ident-mirror.service` (Port 3003) und hängt einen eigenen Site-Block an die
Caddyfile an — bestehende Blöcke bleiben unberührt.

## Alte Simulation stilllegen

```bash
systemctl disable --now webid-sim
rm -rf /opt/apps/webid-sim
# Alten Sim-Site-Block (.de-Wildcard) aus der Caddyfile entfernen
nano /etc/caddy/Caddyfile           # Block "webid-portal.de { ... }" bzw. "*.webid-portal.de { ... }" löschen
systemctl restart caddy
```

Die Datenbank-Tabellen (`webid_sim_domains` etc.) bleiben als Archiv erhalten — nichts geht verloren.

## Freigeben und testen

1. Firewall laut README: Port 443 nur für Cloudflare-IP-Ranges, Port 80 zu.
2. `curl http://127.0.0.1:3003/_health` → muss antworten.
3. `https://webid-portal.com/admin/` öffnen → erstes Admin-Passwort setzen.
4. Einen Vorgang anlegen (Anbieter WebID oder POSTIDENT, Titel/Text), einen echten
   Ident-Link einfügen → „Im Tunnel öffnen" → Strecke inkl. Hinweis prüfen.

## Portal-Seite (bereits vorbereitet, Deploy noch offen)

- Mitarbeiter sehen die WebID-Karte nur noch, wenn der Schalter pro Unternehmen an ist;
  alt: Schalter aus → Karte weg. Deploy via `git pull && bash scripts/deploy.sh`.
