# Caddy zum Laufen bringen — Ident-Mirror scharfschalten

## Stand

- Repo umgestellt ✅
- `ident-mirror.service` läuft auf Port 3003 ✅
- **Caddy failed** ❌ — höchstwahrscheinlich, weil `/etc/caddy/origin.crt` noch das alte Zertifikat (nur `.de`) enthält und nicht für `webid-portal.com` gültig ist. Ohne passendes Zertifikat verweigert Caddy den Start des neuen Site-Blocks.

## Schritt 1: Ursache bestätigen

```bash
systemctl status caddy.service --no-pager | tail -n 30
journalctl -xeu caddy.service --no-pager | tail -n 40
openssl x509 -in /etc/caddy/origin.crt -noout -text | grep -A1 "Subject Alternative Name"
```

Erwartung: In der Zertifikats-Ausgabe steht nur die alte `.de`-Domain, im Log eine Meldung wie „tls: no certificate matching webid-portal.com".

## Schritt 2: Neues Origin-Zertifikat in Cloudflare erzeugen

1. Cloudflare (Konto der Domain `webid-portal.com`) → **SSL/TLS → Origin Server → Create Certificate**.
2. Hosts: `webid-portal.com` (und optional `*.webid-portal.com`), Gültigkeit 15 Jahre.
3. Auf dem Server ersetzen:

```bash
nano /etc/caddy/origin.crt   # kompletten Inhalt durch das neue Zertifikat ersetzen
nano /etc/caddy/origin.key   # kompletten Inhalt durch den neuen Private Key ersetzen
chmod 600 /etc/caddy/origin.*
```

4. Alten `.de`-Site-Block aus `/etc/caddy/Caddyfile` entfernen (Block mit `webid-portal.de` bzw. `*.webid-portal.de`):

```bash
nano /etc/caddy/Caddyfile
```

5. Caddy neu starten und prüfen:

```bash
systemctl restart caddy
systemctl status caddy --no-pager | head -n 15
```

## Schritt 3: Alte Simulation stilllegen

```bash
systemctl disable --now webid-sim
rm -rf /opt/apps/webid-sim
```

Datenbank-Tabellen bleiben als Archiv erhalten.

## Schritt 4: Cloudflare-DNS + Test

- Cloudflare: `webid-portal.com` A-Record → Server-IP, orange Wolke; SSL-Modus **Full (Strict)**.
- Firewall: Port 443 nur für Cloudflare-IP-Ranges (Befehle in `ident-mirror-server/README.md`).

```bash
curl http://127.0.0.1:3003/_health          # Dienst antwortet
curl -I https://webid-portal.com/           # 200/302 von Caddy
```

Dann `https://webid-portal.com/admin/` öffnen → erstes Admin-Passwort setzen → Vorgang anlegen → echten Ident-Link im Tunnel testen.
