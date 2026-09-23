#!/usr/bin/env bash
# =============================================================================
#  setup.sh — Erst-Setup für den Ident-Mirror (Kunden-Server, Cloudflare-Modus)
# =============================================================================
#  Installiert:
#    1. Node.js + Caddy + git
#    2. Kopiert ident-mirror-server nach /opt/apps/ident-mirror
#    3. .env mit PORT + MIRROR_DOMAIN + CONFIG_PATH
#    4. systemd-Service `ident-mirror.service` (Node.js auf 127.0.0.1:3003)
#    5. Caddy mit Cloudflare-Origin-Zertifikat (kein Let's Encrypt nötig)
#
#  Vorab nötig (manuell, einmalig):
#    - Cloudflare: SSL/TLS → Origin Server → Zertifikat erstellen
#      (Hosts: mirror-domain.tld — Wildcard nicht nötig)
#    - Zertifikat nach /etc/caddy/origin.crt, Key nach /etc/caddy/origin.key
#    - Cloudflare SSL-Modus: Full (Strict), DNS @ → orange Wolke
#
#  Pflicht-Env vor Aufruf:
#    MIRROR_DOMAIN=mirror.example.de
#
#  Optional:
#    PROJECT_DIR=/opt/apps/ident-mirror
#    PORT=3003
# =============================================================================
set -euo pipefail

: "${MIRROR_DOMAIN:?MIRROR_DOMAIN nicht gesetzt (z. B. mirror.example.de)}"

PROJECT_DIR="${PROJECT_DIR:-/opt/apps/ident-mirror}"
PORT="${PORT:-3003}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { printf "\n\033[1;36m▸ %s\033[0m\n" "$*"; }
ok()  { printf "\033[1;32m  ✓ %s\033[0m\n" "$*"; }

log "1/4  Node.js + Caddy sicherstellen"
if command -v apt-get >/dev/null; then
  apt-get update
  apt-get install -y curl git nodejs debian-keyring debian-archive-keyring apt-transport-https ca-certificates
  if ! command -v caddy >/dev/null; then
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
    apt-get update
    apt-get install -y caddy
  fi
fi
ok "Node.js + Caddy vorhanden"

log "2/4  Code nach $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
cp -a "$SCRIPT_DIR/." "$PROJECT_DIR/"
ok "Code platziert"

log "3/4  .env schreiben"
cat > "$PROJECT_DIR/.env" <<EOF
PORT=$PORT
MIRROR_DOMAIN=$MIRROR_DOMAIN
CONFIG_PATH=$PROJECT_DIR/config.json
EOF
chmod 600 "$PROJECT_DIR/.env"
# config.json beim ersten Start nicht überschreiben — server legt sie an
ok ".env angelegt"

log "4/4  systemd + Caddy"
cat > /etc/systemd/system/ident-mirror.service <<EOF
[Unit]
Description=Ident-Mirror (Node.js)
After=network.target

[Service]
Type=simple
WorkingDirectory=$PROJECT_DIR
EnvironmentFile=$PROJECT_DIR/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
EOF

mkdir -p /etc/systemd/system/caddy.service.d
cat > /etc/systemd/system/caddy.service.d/override.conf <<EOF
[Service]
Environment=MIRROR_DOMAIN=$MIRROR_DOMAIN
EOF

if [[ ! -s /etc/caddy/origin.crt || ! -s /etc/caddy/origin.key ]]; then
  echo
  echo "⚠️  /etc/caddy/origin.crt bzw. /etc/caddy/origin.key fehlt."
  echo "    Cloudflare → SSL/TLS → Origin Server → Create Certificate"
  echo "    Hosts: $MIRROR_DOMAIN (15 Jahre)"
  echo "    Zertifikat → /etc/caddy/origin.crt, Private Key → /etc/caddy/origin.key"
  echo "    Danach:  chmod 600 /etc/caddy/origin.* && systemctl restart caddy"
fi

cp "$PROJECT_DIR/Caddyfile" /etc/caddy/Caddyfile
systemctl daemon-reload
systemctl enable ident-mirror.service
systemctl restart ident-mirror.service
systemctl enable caddy
systemctl restart caddy || true
sleep 2
systemctl status ident-mirror.service --no-pager | head -n 10

ok "Fertig. Test:  curl http://127.0.0.1:$PORT/_health"
echo
echo "Danach im Browser:  https://$MIRROR_DOMAIN/admin/  → erstes Admin-Passwort setzen."
echo "Firewall: Port 443 nur für Cloudflare-IP-Ranges öffnen, Port 80 schließen"
echo "(Befehle dazu: README.md in diesem Ordner)."
