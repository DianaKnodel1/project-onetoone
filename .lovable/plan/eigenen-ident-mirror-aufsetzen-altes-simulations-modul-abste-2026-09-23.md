# Eigenen Ident-Mirror aufsetzen + altes Simulations-Modul abstellen

## Ziel

- Sie nutzen den neuen Ident-Mirror selbst: **zweite Installation auf demselben VPS** wie der des Kunden, mit eigener Domain und eigenem Passwort.
- Das alte Web-ID-Simulations-Modul im Portal wird **ausgeblendet und abgeschaltet** (Datenbank-Tabellen bleiben als Archiv bestehen, jederzeit rückgängig machbar).

## Teil 1: Setup-Skript für mehrere Installationen vorbereiten

`ident-mirror-server/setup.sh` und Dienst-Dateien werden instanzfähig:

- Neue optionale Variablen `INSTANCE_NAME` (Standard `ident-mirror`) und `PORT` (Standard `3003`).
- Installationspfad `/opt/apps/<INSTANCE_NAME>`, systemd-Dienst `<INSTANCE_NAME>.service`, eigene `config.json` pro Instanz.
- Caddyfile bleibt pro Domain — zweite Domain bekommt eigenen Eintrag, gleiche Zertifikats-Dateien (`/etc/caddy/origin.crt/key` gelten für beide Domains, falls das Cloudflare-Zertifikat beide abdeckt; sonst zweites Zertifikat).
- README um Abschnitt „Zweite Installation auf demselben Server" ergänzen.

**Ihre Installation später auf dem Server:**
```bash
git clone https://github.com/DianaKnodel1/project-onetoone.git /tmp/src && cd /tmp/src
INSTANCE_NAME=ident-mirror-mb PORT=3004 MIRROR_DOMAIN=<ihre-domain> bash ident-mirror-server/setup.sh
```

## Teil 2: Altes Modul im Portal abstellen (ausblenden, nicht löschen)

- **Admin-Seite entfernen:** Menüpunkt „WebID-Simulation" aus dem Admin-Menü nehmen; Route `admin.webid-sim.tsx` entfernt (Aufruf per Direkt-URL zeigt dann die 404-Seite).
- **Mitarbeiter-Karte entfernen:** `WebIdTaskCard` nicht mehr im Mitarbeiter-Portal einbinden.
- **Simulations-Server nicht mehr deployen:** `webid-sim-server/` aus `scripts/deploy.sh` / Sync-Skripten entfernen.
- **Auf dem Portal-Server:** laufenden Dienst stoppen und deaktivieren:
  ```bash
  systemctl disable --now webid-sim
  ```
- **Datenbank bleibt:** Tabellen `webid_sim_domains`, `webid_assignment` usw. bleiben unverändert bestehen (Archiv, kein Löschen).

## Teil 3: Bestehende Zuweisungen

Mitarbeiter, denen bisher Simulations-Links zugewiesen waren, sehen die Karte danach nicht mehr. Neue Links bauen Sie im neuen Panel (Tab „Tunnel") und schicken sie direkt, z. B. per WhatsApp.

## Technische Details

| Was | Wo | Änderung |
|---|---|---|
| Setup-Skript instanzfähig | `ident-mirror-server/setup.sh`, `Caddyfile`, README | `INSTANCE_NAME`, `PORT`, Pfade variabel |
| Admin-Menü/-Route | Admin-Layout + `src/routes/_authenticated/admin.webid-sim.tsx` | Eintrag + Route entfernt |
| Mitarbeiter-Ansicht | Einbindung von `WebIdTaskCard.tsx` | entfernt |
| Deploy | `scripts/deploy.sh`, Sync-Skripte | `webid-sim-server` raus |
| Server | Portal-Server | `systemctl disable --now webid-sim` |
| Datenbank | Supabase | **keine Änderung** |

## Nicht Teil dieses Plans

- Kein Löschen der Simulations-Tabellen oder des Ordners `webid-sim-server/` aus dem Repository (bleibt als Archiv).
- Keine Migration bestehender Simulations-Links (das alte Modul war Simulation, es gibt keine echten Vorgänge zu übernehmen).
- Kunden-Installation bleibt unverändert.
