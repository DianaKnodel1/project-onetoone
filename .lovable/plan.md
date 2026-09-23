# Server auf neues Repo umstellen + Ident-Mirror installieren

## Problem

Der WebID-Server holt den Code noch vom alten Repository `direct-zip-import` — dort fehlt der Ordner `ident-mirror-server/`. Deshalb schlug das Setup fehl (`No such file or directory`).

## Lösung: Remote umstellen, dann Setup erneut laufen lassen

Auf dem Server ausführen:

```bash
cd /opt/apps/portal
git remote set-url origin https://github.com/DianaKnodel1/project-onetoone.git
git fetch --all
git reset --hard origin/main
```

Danach sollte der Ordner da sein — kurz prüfen:

```bash
ls ident-mirror-server/
```

## Danach: Installation wie geplant

```bash
MIRROR_DOMAIN=webid-portal.com bash ident-mirror-server/setup.sh
```

Vorher einmalig prüfen, dass das vorhandene Origin-Zertifikat auch für **webid-portal.com** ausgestellt wurde (nicht nur für die alte .de-Domain):

```bash
openssl x509 -in /etc/caddy/origin.crt -noout -text | grep -A1 "Subject Alternative Name"
```

Steht dort nur die alte Domain: in Cloudflare ein neues Zertifikat mit Host `webid-portal.com` erzeugen und `/etc/caddy/origin.crt` + `/etc/caddy/origin.key` ersetzen, sonst schlägt der Browser-Handshake fehl.

## Alte Simulation stilllegen

```bash
systemctl disable --now webid-sim
rm -rf /opt/apps/webid-sim
# Alten Sim-Site-Block (webid-portal.de / *.webid-portal.de) aus /etc/caddy/Caddyfile entfernen
systemctl restart caddy
```

Die Datenbank-Tabellen bleiben als Archiv erhalten.

## Test

1. `curl http://127.0.0.1:3003/_health` → muss antworten.
2. `https://webid-portal.com/admin/` öffnen → erstes Admin-Passwort setzen.
3. Vorgang anlegen (WebID oder POSTIDENT), echten Ident-Link einfügen → „Im Tunnel öffnen" → Strecke inkl. Hinweis prüfen.
4. Firewall laut README: Port 443 nur für Cloudflare-IP-Ranges, Port 80 zu.
