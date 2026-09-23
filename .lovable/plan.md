# Caddy zum Laufen bringen — doppelter Site-Block entfernen

## Stand

- Repo umgestellt ✅
- `ident-mirror.service` läuft auf Port 3003 ✅
- Zertifikat passt: deckt `webid-portal.com` + `*.webid-portal.com` ab ✅
- **Caddy failed:** `ambiguous site definition: webid-portal.com` — die Domain steht **zweimal** in `/etc/caddy/Caddyfile`. Ein älterer Block existiert schon (vermutlich aus der früheren Einrichtung), das Setup-Skript hat einen zweiten angehängt.

## Schritt 1: Doppelten Block finden

```bash
grep -n "webid-portal.com" /etc/caddy/Caddyfile
cat /etc/caddy/Caddyfile
```

Dann in `nano /etc/caddy/Caddyfile` den **alten/überzähligen** Block komplett löschen (von `webid-portal.com {` bis zur schließenden `}`). Übrig bleiben soll genau einer — idealerweise der neue mit `reverse_proxy 127.0.0.1:3003`.

Falls der alte Block auf Port 3002 zeigt (alte Simulation), sicher diesen entfernen.

## Schritt 2: Konfiguration prüfen und Caddy starten

```bash
caddy validate --config /etc/caddy/Caddyfile
systemctl restart caddy
systemctl status caddy --no-pager | head -n 15
```

`caddy validate` muss „Valid configuration" melden, bevor du neu startest.

## Schritt 3: Alte Simulation stilllegen (falls noch nicht geschehen)

```bash
systemctl disable --now webid-sim
rm -rf /opt/apps/webid-sim
```

Und den veralteten systemd-Drop-in aufräumen (steht noch im Log: `SIM_BASE_DOMAIN=webid-portal.de`):

```bash
rm -rf /etc/systemd/system/caddy.service.d/override.conf
systemctl daemon-reload
```

Auch den alten `.de`-Site-Block (`webid-portal.de` / `*.webid-portal.de`) aus der Caddyfile entfernen, dann erneut `caddy validate` + `systemctl restart caddy`.

Die Datenbank-Tabellen bleiben als Archiv erhalten.

## Schritt 4: Test

```bash
curl http://127.0.0.1:3003/_health          # Dienst antwortet
curl -I https://webid-portal.com/           # Antwort über Caddy
```

Dann `https://webid-portal.com/admin/` öffnen → erstes Admin-Passwort setzen → Vorgang anlegen → echten Ident-Link im Tunnel testen.
Firewall laut README: Port 443 nur für Cloudflare-IP-Ranges, Port 80 zu.
