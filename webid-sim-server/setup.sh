#!/usr/bin/env bash
# =============================================================================
#  setup.sh — Erst-Setup für WebID-Simulations-Proxy (Cloudflare-Modus)
# =============================================================================
#  Installiert:
#    1. Node.js + Bun (Build) + Caddy + git
#    2. Kopiert webid-sim-server nach /opt/apps/webid-sim
#    3. .env mit SUPABASE_URL + ANON_KEY + SIM_BASE_DOMAIN
#    4. systemd-Service `webid-sim.service` (Node.js auf 127.0.0.1:3002)
#    5. Caddy mit Cloudflare-Origin-Zertifikat (kein Let's Encrypt nötig)
#
#  Vorab nötig (manuell, einmalig):
#    - Cloudflare: SSL/TLS → Origin Server → Zertifikat erstellen
#      (Hosts: webid-portal.de, *.webid-portal.de, 15 Jahre)
#    - Zertifikat nach /etc/caddy/origin.crt, Key nach /etc/caddy/origin.key
#    - Cloudflare SSL-Modus: Full (Strict), DNS * und @ → orange Wolke
#
#  Pflicht-Env vor Aufruf:
#    SUPABASE_URL=https://supabase.deine-domain.de
#    SUPABASE_PUBLISHABLE_KEY=<anon-key>
#    SIM_BASE_DOMAIN=webid-portal.de
#
#  Optional:
#    PROJECT_DIR=/opt/apps/webid-sim
#    DEFAULT_TARGET_ORIGIN=https://webid-gateway.de
# =============================================================================
set -euo pipefail

: "${SUPABASE_URL:?SUPABASE_URL nicht gesetzt}"
: "${SUPABASE_PUBLISHABLE_KEY:?SUPABASE_PUBLISHABLE_KEY nicht gesetzt}"
: "${SIM_BASE_DOMAIN:?SIM_BASE_DOMAIN nicht gesetzt (z. B. webid-portal.de)}"

PROJECT_DIR="${PROJECT_DIR:-/opt/apps/webid-sim}"
DEFAULT_TARGET_ORIGIN="${DEFAULT_TARGET_ORIGIN:-https://webid-gateway.de}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { printf "\n\033[1;36m▸ %s\033[0m\n" "$*"; }
ok()  { printf "\033[1;32m  ✓ %s\033[0m\n" "$*"; }

log "1/4  Node.js + Bun + Caddy sicherstellen"
if command -v apt-get >/dev/null; then
  apt-get update
  apt-get install -y curl unzip git nodejs debian-keyring debian-archive-keyring apt-transport-https ca-certificates
  if ! command -v caddy >/dev/null; then
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
    apt-get update
    apt-get install -y caddy
  fi
fi
if ! command -v bun >/dev/null; then
  curl -fsSL https://bun.sh/install | bash
  ln -sf /root/.bun/bin/bun /usr/local/bin/bun
fi
ok "Node.js + Bun + Caddy vorhanden"

log "2/4  Code nach $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
cp -a "$SCRIPT_DIR/." "$PROJECT_DIR/"
cd "$PROJECT_DIR"
bun install --production >/dev/null 2>&1 || true
bun build server.ts --target=node --outfile=server.js
ok "Code platziert"

log "3/4  .env schreiben"
cat > "$PROJECT_DIR/.env" <<EOF
SUPABASE_URL=$SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY=$SUPABASE_PUBLISHABLE_KEY
PORT=3002
SIM_BASE_DOMAIN=$SIM_BASE_DOMAIN
DEFAULT_TARGET_ORIGIN=$DEFAULT_TARGET_ORIGIN
EOF
chmod 600 "$PROJECT_DIR/.env"
ok ".env angelegt"

log "4/4  systemd + Caddy"
cat > /etc/systemd/system/webid-sim.service <<EOF
[Unit]
Description=WebID-Simulations-Proxy (Node.js)
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
Environment=SIM_BASE_DOMAIN=$SIM_BASE_DOMAIN
EOF

if [[ ! -s /etc/caddy/origin.crt || ! -s /etc/caddy/origin.key ]]; then
  echo
  echo "⚠️  /etc/caddy/origin.crt bzw. /etc/caddy/origin.key fehlt."
  echo "    Cloudflare → SSL/TLS → Origin Server → Create Certificate:"
  echo "    Hosts: $SIM_BASE_DOMAIN, *.$SIM_BASE_DOMAIN (15 Jahre)"
  echo "    Zertifikat → /etc/caddy/origin.crt, Private Key → /etc/caddy/origin.key"
  echo "    Danach:  chmod 600 /etc/caddy/origin.* && systemctl restart caddy"
fi

# Caddyfile zusammenführen statt überschreiben:
# Bestehenden Block für $SIM_BASE_DOMAIN (inkl. Wildcard) entfernen,
# alle anderen Blöcke (z. B. ident-mirror webid-portal.com) bleiben erhalten.
CADDY_TARGET=/etc/caddy/Caddyfile
if [[ -f "$CADDY_TARGET" ]]; then
  python3 - "$CADDY_TARGET" "$SIM_BASE_DOMAIN" <<'PYEOF'
import re, sys
path, domain = sys.argv[1], sys.argv[2]
with open(path) as f:
    text = f.read()
# Bloecke sind durch Leerzeilen getrennt; Bloecke entfernen, die unsere Domain als Site-Adresse haben
blocks = re.split(r'\n\s*\n', text)
def is_ours(block):
    first = block.strip().splitlines()[0] if block.strip() else ''
    return domain in first
kept = [b for b in blocks if b.strip() and not is_ours(b)]
with open(path, 'w') as f:
    f.write('\n\n'.join(kept).strip() + ('\n' if kept else ''))
PYEOF
fi
# Unseren Block anhaengen
{
  echo
  cat "$PROJECT_DIR/Caddyfile"
} >> "$CADDY_TARGET"
caddy validate --config "$CADDY_TARGET" || { echo "⚠️  Caddy-Konfiguration ungültig — bitte $CADDY_TARGET prüfen."; }
systemctl daemon-reload
systemctl enable webid-sim.service
systemctl restart webid-sim.service
systemctl enable caddy
systemctl restart caddy || true
sleep 2
systemctl status webid-sim.service --no-pager | head -n 10

ok "Fertig. Test:  curl http://127.0.0.1:3002/_health"
echo
echo "Nicht vergessen: Firewall — Port 443 nur für Cloudflare-IP-Ranges öffnen,"
echo "Port 80 komplett schließen (siehe README)."
