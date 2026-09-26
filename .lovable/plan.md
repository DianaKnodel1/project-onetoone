# WebID: bv-agentur.webid-portal.com zeigt weißes Bild

## Wahrscheinliche Ursache (noch unbestätigt)
Beim letzten Mal zeigte `testumgebung.webid-portal.com` genau dasselbe weiße Bild. Der Grund war, dass der Webserver (Caddy) diese Adresse nicht kannte. Wir haben damals nur für `testumgebung` einen eigenen Eintrag angelegt. `bv-agentur` hat noch keinen. Deshalb weiß der Server nicht, wohin er die Anfrage schicken soll, und liefert eine leere Seite aus.

Eine zweite mögliche Ursache: Die Domain `bv-agentur.webid-portal.com` ist in /admin/webid-sim nicht angelegt oder nicht aktiv geschaltet.

## Schritt 1: Kurz prüfen (auf dem WebID-Server 190.97.165.224)
```bash
grep -n "webid-portal.com" /etc/caddy/Caddyfile
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: bv-agentur.webid-portal.com" http://127.0.0.1:3002/
```
- Taucht `bv-agentur` in der Caddyfile nicht auf, ist das die Ursache (Schritt 2).
- Liefert der zweite Befehl 404, fehlt die Domain im Admin oder sie ist inaktiv. Dann in /admin/webid-sim anlegen bzw. aktivieren.

## Schritt 2: Dauerhafte Lösung, damit das nie wieder passiert
Statt für jede Firma einen eigenen Eintrag anzulegen, bekommt die Caddyfile einen einzigen Sammel-Eintrag. Er leitet alle Adressen unter `*.webid-portal.com` an die Simulation (Port 3002) weiter. Die Hauptadresse `webid-portal.com` bleibt beim Mirror (Port 3003). Das Zertifikat deckt `*.webid-portal.com` schon ab.

Den Einzel-Eintrag für `testumgebung.webid-portal.com` entfernen wir dabei, weil er sonst mit dem Sammel-Eintrag kollidiert.

Das bauen wir auch fest ins Setup-Skript ein (`webid-sim-server/setup.sh`): Es legt den Sammel-Eintrag automatisch an, lässt andere Einträge in Ruhe und prüft die Konfiguration, bevor es neu startet. Jede neue Firmen-Domain funktioniert dann sofort, sobald sie im Admin angelegt ist.

## Technische Details
- Caddy-Block: `*.webid-portal.com { tls /etc/caddy/origin.crt /etc/caddy/origin.key; reverse_proxy 127.0.0.1:3002 { header_up Host {host}; header_up X-Real-IP {http.request.header.CF-Connecting-IP} } }`
- setup.sh: optional `SIM_WILDCARD_DOMAIN=webid-portal.com` einführen. Die Einträge sind durch Markierungs-Kommentare abgegrenzt, damit sie sich ersetzen lassen. Danach `caddy validate`, dann `systemctl reload caddy`.
- Außerdem liefern wir Befehle zum Einfügen per Hand, damit es sofort ohne erneutes Setup läuft.
