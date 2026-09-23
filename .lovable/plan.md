# WebID-Modul für Ihren Kunden aufsetzen

## Antwort auf Ihre Frage

**Ja, genau so.** Das WebID-Modul wird an Ihr bestehendes Portal angeschlossen — Ihr Kunde braucht keinen eigenen Portal-Zugang und keinen eigenen Server für die Verwaltung. Sie verwalten alles zentral in Ihrem Admin unter `/admin/webid-sim`:

- neue Simulations-Domain/Subdomain anlegen (z. B. `webid.kundenname.de`)
- „Submit an Original" pro Domain aktivieren/deaktivieren
- Domains aktivieren/pausieren, Anzeigename, Topbar-Text, Logo, Ziel-Origin

Der Kunde bekommt von Ihnen nur fertige Simulations-Links (dafür gibt es im Admin den „Original-Link → Simulations-Link"-Umschreiber).

## Wie die Teile zusammenhängen

```text
Ihr Portal (bestehend, 190.97.167.124)
  └─ Admin /admin/webid-sim  →  verwaltet Domains in der Datenbank (api.mb-portal.com)

Neuer Server (nur WebID-Proxy)
  └─ liest alle 60 Sek. die aktiven Domains aus derselben Datenbank (nur lesen, öffentlicher Schlüssel)
  └─ liefert unter diesen Domains die WebID-Seite mit Simulations-Kennzeichnung aus

Ihr Kunde
  └─ öffnet einfach die Simulations-Links — kein Login, kein Portal nötig
```

Änderungen, die Sie im Admin speichern, greifen spätestens nach 60 Sekunden auf dem Proxy (Cache). Es ist also **kein zweites Portal und keine zweite Datenbank** nötig — nur der kleine Proxy-Dienst zieht auf den neuen Server um.

## Server-Empfehlung

**KVM-VPS**, kein Docker-VPS:

- 2 vCPU, 2 GB RAM, 20 GB SSD — mehr braucht der Proxy nicht
- Ubuntu 24.04, Standort Deutschland/EU
- Der Dienst läuft als Systemdienst mit automatischem Neustart, kein Docker nötig

## Voraussetzungen

1. **Domain für die Simulations-Umgebung** in **Cloudflare** (kostenlos) — z. B. eine neutrale Domain wie `webid-portal.de`; die Kunden-Subdomains laufen dann alle darunter (`kunde1.webid-portal.de`, `kunde2.webid-portal.de`).
2. In Cloudflare: Origin-Zertifikat erstellen (Hosts: `domain.tld` + `*.domain.tld`), SSL-Modus **Full (Strict)**, DNS `@` und `*` auf die neue Server-IP mit oranger Wolke.
3. `SUPABASE_URL` (api.mb-portal.com) und öffentlicher Schlüssel (anon key) Ihres Portals — der Proxy braucht nur Lesezugriff auf die Domain-Liste.

## Umsetzungsschritte

1. **`webid-sim-server/setup.sh` prüfen und leicht anpassen**, damit es auf frischem Ubuntu 24.04 sauber durchläuft (Caddy-Paketquelle, Firewall-Teil mit aktuellen Cloudflare-IP-Bereichen aus `scripts/update-cloudflare-ips.sh`).
2. **Fertige Installations-Befehlsfolge** für den neuen Server liefern:
   ```bash
   git clone https://github.com/DianaKnodel1/project-onetoone.git /tmp/portal
   cd /tmp/portal
   SUPABASE_URL=https://api.mb-portal.com \
   SUPABASE_PUBLISHABLE_KEY=<anon-key> \
   SIM_BASE_DOMAIN=<sim-domain.tld> \
   bash webid-sim-server/setup.sh
   ```
   Danach Cloudflare-Zertifikat nach `/etc/caddy/origin.crt` + `origin.key`, `systemctl restart caddy`.
3. **Firewall:** Port 22 offen, 443 nur für Cloudflare-IP-Bereiche, 80 geschlossen — Server-IP bleibt verborgen.
4. **Test:** `curl http://127.0.0.1:3002/_health`, dann in Ihrem Admin eine Test-Domain anlegen, Simulations-Link erzeugen und prüfen, dass Topbar/Popup erscheinen und POST blockiert ist.
5. **Für den Kunden freischalten:** Domain für den Kunden in `/admin/webid-sim` anlegen, dem Kunden die Simulations-Links geben — fertig.

## Nicht Teil davon

- Kein Portal-Zugang für den Kunden, keine Rechtevergabe — die Verwaltung bleibt komplett bei Ihnen
- Kein zweites Portal, keine zweite Datenbank, kein Umzug bestehender Dienste
- Keine echte WebID-Anbindung — Simulations-/Schulungsumgebung mit den vorhandenen Leitplanken (keine echten Absendungen ohne Ihre Freigabe, Whitelist-Pfade, Rate-Limit, noindex)

## Technische Details

- Dienst: Node.js (aus `webid-sim-server/server.ts` gebaut), 127.0.0.1:3002, davor Caddy :443 mit Cloudflare-Origin-Zertifikat
- Datenbankzugriff: nur `SELECT` auf `public.webid_sim_domains` via anon key + RLS (nur aktive Domains lesbar) — Tabelle existiert bereits auf api.mb-portal.com
- Datenfluss: Besucher → Cloudflare → Caddy → Node-Proxy → webid-gateway.de; Overlay (Topbar, Popup, `[SIMULATION]`-Titel) wird serverseitig injiziert
