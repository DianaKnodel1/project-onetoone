# Vertrauen sichtbar machen: Zusage-Seite, Begründungen, flexible Terminstrecke

Ziel: An den Stellen, an denen Bewerber zweifeln — Zusage, Ausweis,
Personaldaten — Seriosität sichtbar machen und die Terminstrecke an die
Realität anpassen (das Gespräch ist flexibel, kein fester Termin nötig).

## 1. Zusage-Seite: Mensch statt „HR Management"

1. **Ansprechpartner-Karte** mit Name, Foto, Funktion (aus den
   Mandanten-Feldern, gleiche Quelle wie die Teamleiter-Karte) direkt auf
   der Zusage — statt „HR Management".
2. **Firmenangaben sichtbar:** Ort/Anschrift, Geschäftsführer (aus den
   Mandanten-Daten).
3. **„Bitte bereithalten"-Liste mit Begründungen:**
   - Personalausweis — „zur Identitätsprüfung, wie bei jeder Anstellung"
   - IBAN — „für die Überweisung deines Gehalts"
   - Steuer-ID — „für die Lohnabrechnung — gesetzlich vorgeschrieben"

## 2. Begründungen an den Dateneingabe-Schritten

- **Ausweis-Schritt** (`verification.tsx`): Nutzen-Satz über dem Upload
  ergänzen (WhatsApp-Hinweis ist bereits vorhanden).
- **Personal-Daten** (`personal-data.tsx`; Steuer-ID, SV-Nummer, IBAN):
  pro Feld ein kurzer Begründungssatz; IBAN bleibt letzter Schritt.
- **Vertrag:** Nutzen-Satz und vorausgefüllter Name sind bereits umgesetzt.

## 3. Terminstrecke: Flexibilität klar sagen (A)

Der Termin wird nur pro forma ausgemacht — das Interview kann jederzeit
wahrgenommen werden. Genau das muss der Bewerber im Danke-Fenster lesen,
sonst fühlt sich ein verpasster Termin wie „jetzt ist es zu spät" an:

1. **Danke-Fenster** (`form-section.js`): statt der verbindlichen
   Bestätigungs-Formulierung eine flexible Botschaft — „Termin passt nicht?
   Das Gespräch ist flexibel. Melde dich einfach per WhatsApp, dann führen
   wir es, wann es dir passt." WhatsApp-Knopf bleibt.
2. **Termin-Erinnerungs-Szene:** dieselbe Flexibilitäts-Botschaft auf dem
   Danke-Screen im Portal (falls dort noch eine Termin-Karte erscheint).

## 4. Messung

- Kein neuer Code: `analyze-no-shows.sh` hat den Registrierungs-Trichter
  bereits (Abschnitt 19). Vergleich über 2–3 Wochen vorher/nachher
  (`DAYS=90 bash scripts/analyze-no-shows.sh --local` auf deinem Server).

## Nicht Teil dieses Schritts

- Sozialer Beweis (Zähler, Mitarbeiterstimmen) — erstmal nicht
- Lead-Menge — eigenes Thema, später
- Automatische Erinnerungen/Nachrichten — eigene Mails bleiben aus,
  Calendly + manuelles WhatsApp reichen

## Technisch kurz

- `src/components/interview/ZusageCard.tsx`: Ansprechpartner-Karte
  (Mandanten-Felder team_leader_*), Firmenangaben, Begründungen hinter
  „Bitte bereithalten".
- `src/routes/_employee/verification.tsx`: Nutzen-Satz über dem Upload.
- `src/routes/_employee/personal-data.tsx`: Begründungssätze pro Feld.
- `src/landing-themes/_shared/form-section.js`: Flexibilitäts-Botschaft im
  Danke-Fenster (WhatsApp-Bestätigungstext entschärfen).
- Keine Migration nötig — alle Daten existieren bereits.
- Deploy: `bash scripts/deploy.sh` + Landing-Sync.
