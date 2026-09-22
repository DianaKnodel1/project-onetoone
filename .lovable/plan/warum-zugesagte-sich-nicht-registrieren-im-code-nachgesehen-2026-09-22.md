# Warum Zugesagte sich nicht registrieren — im Code nachgesehen

Ich habe den Weg „Zusage im Gespräch → Registrierung" komplett durchgelesen.
Die Zusage wird tatsächlich sofort im Gespräch angezeigt. Trotzdem gibt es
vier Stellen, an denen das System den Bewerber verliert.

## Was ich gefunden habe (geprüft, nicht vermutet)

1. **Die Karte verspricht eine E-Mail, die es nicht mehr gibt.**
   Der Mailversand ist hart abgeschaltet (`send-guard.ts` gibt für jeden
   Versand „Mail-los-Modus" zurück). Die Einladungsfunktion antwortet
   deshalb immer mit „Versand blockiert". Folge: die Zusage-Karte zeigt
   jedes Mal den gelben Hinweis „Die Bestätigungs-E-Mail ist noch
   unterwegs" — und wenn kein persönlicher Link vorliegt, sogar nur den
   Satz „Sie erhalten in wenigen Minuten eine E-Mail … bitte Spam-Ordner
   prüfen". Der Bewerber wartet dann auf etwas, das nie kommt.

2. **Ohne hinterlegte Portal-Domain gibt es gar keinen Knopf.**
   Der Registrierungslink wird nur gebaut, wenn für die Bewerbung eine
   Portal-Domain auflösbar ist (`portal-base.server.ts`). Ist sie es
   nicht, liefert das System weder Link noch Ersatz-Link — die Zusage-Karte
   ist dann eine Sackgasse mit dem E-Mail-Hinweis von Punkt 1.

3. **Kein zweiter Anlauf nach dem Schließen des Tabs.**
   Wer die Seite verlässt, kommt nur über den Gesprächs-Link zurück. Es
   gibt nichts, was den persönlichen Registrierungslink dauerhaft beim
   Bewerber lässt (kein Mail, keine WhatsApp-Nachricht, nichts im Browser
   gespeichert).

4. **Die Registrierung startet mit der härtesten Hürde.**
   Erster Schritt verlangt Vorname, Nachname, E-Mail und Passwort. Aus der
   Einladung wird aktuell nur die E-Mail vorausgefüllt — Name und Telefon
   liegen aus der Bewerbung längst vor, werden aber nicht übernommen.

Zusätzlich: jede Zusage wird intern als „Einladungsmail fehlgeschlagen"
protokolliert, weil der Versand geblockt ist. Das verfälscht die Admin-Sicht.

## Was ich ändern will

### 1. Zusage-Karte ehrlich und sackgassenfrei
- Kein E-Mail-Versprechen mehr: Text wird „Ihre Registrierung schließen Sie
  direkt hier ab" statt „Sie erhalten eine E-Mail".
- Der gelbe „Mail unterwegs"-Hinweis entfällt im Mail-losen Betrieb.
- Immer ein funktionierender Knopf: fehlt die Portal-Domain, führt der
  Knopf auf die Registrierung der aktuellen Domain mit vorausgefüllter
  E-Mail. Kein Zustand ohne Weiter-Knopf.

### 2. Link beim Bewerber lassen
- Knopf „Link an mich per WhatsApp" — öffnet WhatsApp mit dem persönlichen
  Registrierungslink im Text. Damit liegt der Link im eigenen Chatverlauf
  und ist morgen noch da.
- Zusätzlich wird der Link im Browser des Bewerbers gemerkt: ruft er die
  Gesprächsseite erneut auf, steht die Zusage samt Knopf sofort wieder da.

### 3. Registrierung verkürzen
- Vorname, Nachname und Telefon aus der Bewerbung vorausfüllen (der Link
  trägt die Bewerbungs-Kennung bereits mit sich).
- Damit bleibt im ersten Schritt faktisch nur noch das Passwort.
- Über den Feldern ein Satz „Noch 2 Minuten bis zum Start".

### 4. Nachfassen möglich machen
- Im Admin eine Liste „Zusage erteilt, aber nicht registriert" mit Datum
  und einem WhatsApp-Knopf pro Person (vorgefertigter Text inkl.
  persönlichem Registrierungslink).
- Die irreführende Protokollierung „Einladungsmail fehlgeschlagen" wird im
  Mail-losen Betrieb zu „bewusst kein Mailversand" — damit stimmt die
  Statistik wieder.

## Nicht Teil davon
- Keine Wiederbelebung eigener E-Mails.
- Am Gesprächsablauf und an der KI-Bewertung ändert sich nichts.
- Bestehende Landing-Seiten bleiben unberührt.

## Technisch kurz
- `src/components/interview/ZusageCard.tsx`: Texte, WhatsApp-Link-Versand,
  Wegfall des Mail-Hinweises, Pflicht-Fallback für den Knopf.
- `src/routes/interview.$appId.tsx` und `interview.voice.$appId.tsx`:
  Fallback-Link auch ohne aufgelöste Portal-Basis, Link in `localStorage`
  merken und beim erneuten Aufruf wieder anzeigen.
- `src/routes/api/public/interview-chat.ts`: bei Zusage immer einen
  nutzbaren Link zurückgeben (vorhandenes Token verwenden statt nur bei
  erfolgreichem Mailversand).
- `src/lib/interview-engine.server.ts`: Ergebnis „mailless" nicht mehr als
  `failed` an der Bewerbung protokollieren, sondern als `skipped` mit Grund.
- `src/routes/register.tsx` / `StepAccount.tsx`: Name und Telefon aus der
  Bewerbung (über `ref=<Bewerbungs-ID>`) vorausfüllen, Zeitversprechen.
- Admin-Liste in `src/routes/admin.bewerbungen.tsx` als Filter
  „Zusage ohne Registrierung" inkl. WhatsApp-Knopf.
- Danach: `bunx tsgo --noEmit`, dann auf dem Server
  `git pull && bash scripts/deploy.sh`.
