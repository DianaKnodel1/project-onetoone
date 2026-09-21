# Vertrauen sichtbar machen: Zusage, Ausweis, Personaldaten (A + B)

Ziel: An den drei Stellen, an denen Bewerber zweifeln — Danke-Fenster, Zusage,
Dateneingabe — Seriosität sichtbar machen und die Terminstrecke abschließen.
Alles echt, nichts Erfundenes: Bleibt ein Feld leer, erscheint es nicht.

## 1. Sozialer Beweis (echt, aus Daten)

1. **Neuer öffentlicher RPC `get_public_tenant_stats`** (SECURITY DEFINER,
   anon-lesbar): liefert pro Mandant nur die Anzahl aktiver Mitarbeiter —
   sonst keine Daten.
2. **Mandanten-Felder für Mitarbeiterstimmen:** `testimonial_1_text`,
   `testimonial_1_author`, `testimonial_2_text`, `testimonial_2_author`
   (Migration + GRANTs). Im Admin (Einstellungen) pflegbar.
3. **Beweis-Komponente** „Über X aktive Mitarbeiter arbeiten aktuell über uns"
   + bis zu 2 Mitarbeiterstimmen (Vorname + Tätigkeit). Eingebaut auf:
   - Zusage-Seite (`ZusageCard.tsx`)
   - Registrierungs-Abschluss (Step 99 in `register.tsx`)
   - Danke-Modal auf den Landing Pages (`form-section.js`; Stats werden wie
     `WHATSAPP_NUMBER` als `window.TENANT_STATS` injiziert — Landing-Server
     erweitern)

## 2. Zusage-Seite: Mensch statt „HR Management"

1. **Ansprechpartner-Karte** mit Name, Foto, Funktion (gleiche Datenquelle
   wie die Teamleiter-Karte) direkt auf der Zusage.
2. **Firmenangaben sichtbar:** Ort/Anschrift, Geschäftsführer (aus den
   Mandanten-Daten).
3. **„Bitte bereithalten"-Liste mit Begründungen:**
   - Personalausweis — „zur Identitätsprüfung, wie bei jeder Anstellung"
   - IBAN — „für die Überweisung deines Gehalts"
   - Steuer-ID — „für die Lohnabrechnung — gesetzlich vorgeschrieben"

## 3. Begründungen an den Dateneingabe-Schritten

- **Ausweis-Schritt** (`verification.tsx`): Nutzen-Satz über dem Upload
  ergänzen (WhatsApp-Hinweis ist bereits vorhanden).
- **Personal-Daten** (Steuer-ID, SV-Nummer, IBAN): pro Feld ein kurzer
  Begründungssatz; IBAN bleibt letzter Schritt.
- **Vertrag:** Nutzen-Satz und vorausgefüllter Name sind bereits umgesetzt.

## 4. Terminstrecke abschließen (A)

- Im Danke-Fenster (`form-section.js`) ergänzen: „Termin verpasst?
  Verschieben ist kein Problem — einfach einen neuen Termin wählen"
  (Link zur Calendly-Buchung).
- Ohne Code (Checkliste an dich): persönliche WhatsApp in der ersten Stunde
  nach der Buchung vom echten Handy.

## 5. Messung

- Kein neuer Code: `analyze-no-shows.sh` hat den Registrierungs-Trichter
  bereits (Abschnitt 19). Vergleich über 2–3 Wochen vorher/nachher
  (`DAYS=90 bash scripts/analyze-no-shows.sh --local` auf deinem Server).

## Nicht Teil dieses Schritts

- Lead-Menge (C) — eigenes Thema, später
- WhatsApp Business Plattform (360dialog/Twilio) — später
- Automatische Erinnerungen/Nachfass-Nachrichten — eigene Mails bleiben aus,
  Calendly + manuelles WhatsApp reichen

## Technisch kurz

- Migration: `ALTER TABLE tenants ADD COLUMN testimonial_*`; RPC
  `get_public_tenant_stats` inkl. `GRANT SELECT ... TO anon` (in derselben
  Migration).
- Dateien: `src/components/interview/ZusageCard.tsx`,
  `src/routes/register.tsx` (Step 99), `src/routes/_employee/verification.tsx`,
  Personal-Daten-Schritt, `src/landing-themes/_shared/form-section.js`,
  `src/routes/admin.settings.tsx` (Stimmen pflegen), Landing-Server (Stats
  injizieren).
- Deploy: `bash scripts/deploy.sh` + Landing-Sync.

## Womit ich dich brauche

- 1–2 echte Mitarbeiterzitate (Vorname + Tätigkeit + 1 Satz)
- Freigabe, wie die Zähler-Formulierung klingen soll
  („Über X aktive Mitarbeiter arbeiten aktuell über uns")
