# Ein Auftritt statt zwei: Bewerbung und Termin auf derselben Seite

Ziel: Bewerber bleiben von der Anzeige bis zum Gespräch bei einer Marke.
Kein Wechsel mehr von z. B. personalservice-gmbh.de zu bv-agentur.com.
Das ist die wahrscheinlichste Ursache für die vielen Nichterscheiner:
Der Termin wird bei einem fremden Namen gebucht, und bis zum Termin
passt die Erinnerung nicht mehr zu dem, wo man sich beworben hat.

## Ablauf heute und künftig

```text
HEUTE
Anzeige -> personalservice-gmbh.de (Bewerbung)
        -> Hinweis "Sie werden verbunden"
        -> Calendly von bv-agentur.com (fremder Name)
        -> Termin: Absender/Marke passen nicht  -> viele erscheinen nicht

KÜNFTIG
Anzeige -> personalservice-gmbh.de (Bewerbung)
        -> Danke-Seite derselben Seite, Termin direkt dort
        -> Bestätigung und Erinnerungen von personalservice-gmbh.de
        -> Portal später unter portal.personalservice-gmbh.de
```

## Was gebaut wird

1. **Neue Seiten laufen einheitlich.** Im Landing-Generator gibt es künftig
   nur noch eine Art Landing Page: Bewerbung, Terminbuchung und Portal
   gehören zur selben Firma und Domain. Die Auswahl "Vermittlung" entfällt
   für neue Seiten.
2. **Termin ohne Markenwechsel.** Die Terminauswahl erscheint direkt auf der
   Danke-Seite der Bewerbungsdomain, im Design dieser Seite. Kein
   Zwischentext "Sie werden verbunden", kein sichtbarer Sprung auf eine
   fremde Domain.
3. **Bestätigung und Erinnerungen aus einer Hand.** Terminbestätigung,
   Erinnerung vor dem Gespräch und die Nachfass-Mails kommen mit Absender
   und Namen der Seite, auf der man sich beworben hat.
4. **Bestehende Seiten laufen unverändert weiter.** Sie behalten ihre
   bisherige Weiterleitung und ihre Portal-Adresse. Es wird nichts
   umgezogen und keine neue Portal-Subdomain für sie gebraucht.
5. **Aufräumen im Hintergrund.** Die alte Zwischenseite und doppelte
   Konfiguration (Partnerfirmen, verknüpfte Zweitseite) verschwinden aus
   der Oberfläche für neue Seiten, bleiben aber für die Altseiten aktiv.

## Zusätzlich gegen Nichterscheinen

Auch ohne Umbau helfen diese Punkte sofort und werden mitgebaut:

- Auf der Danke-Seite steht klar, mit wem das Gespräch stattfindet,
  wie lange es dauert und was mitzubringen ist.
- Erinnerung 24 Stunden und 1 Stunde vor dem Termin, mit Link zum
  Verschieben statt nur Absagen.
- Wer nicht erscheint, bekommt eine kurze Mail mit einem neuen
  Terminlink statt nur eine Absage.

## Offene Entscheidung

Bei bestehenden Vermittlungsseiten bleibt der Markenwechsel bestehen.
Wenn dort viel Budget läuft, kann als Zwischenschritt die Terminauswahl
auf der Bewerbungsdomain eingebettet und der Absender der Termin-Mails
auf die Bewerbungsdomain umgestellt werden — ohne Portal-Umzug.
Bitte sagen, ob das für die laufenden Seiten gewünscht ist.

## Technische Umsetzung

- `flow_type`: neue Landings nur noch `classic`/`fast`; `broker` bleibt für
  Bestandsdatensätze gültig (kein Constraint-Abbau, nur UI-seitig entfernt).
- `admin.landing-generator.tsx`: Modus-Auswahl auf Fast-Track reduziert,
  Felder `linked_fasttrack_landing_id` / `partner_company_id` nur noch
  sichtbar, wenn die Seite bereits `broker` ist (Bearbeitung von Altseiten).
- `src/routes/api/public/applications.ts`: Für `flow_type='fast'` mit
  eigenem `calendly_url` wird der bestehende `useCalendly`-Zweig genutzt;
  Antwort liefert Terminlink plus Firmenname der eigenen Landing. Der
  `isBroker`-Zweig bleibt für Altseiten unverändert bestehen.
- `src/landing-themes/_shared/form-section.js`: Danke-Karte rendert die
  Terminauswahl im Theme-Design statt der "Sie werden verbunden"-Optik;
  Partnername nur noch anzeigen, wenn er von der eigenen Landing abweicht.
- `admin.vermittlung.tsx` und `admin.partner-companies.tsx` bleiben als
  Bestandsverwaltung, verschwinden aber aus der Hauptnavigation.
- Mails: `sender-resolver.ts` unverändert lassen; für nicht-broker
  Bewerbungen greift bereits die Tenant-Domain der Bewerbungsseite.
- Reminder: `send-application-reminders` um Erinnerung 1 h vor Termin und
  Verschiebe-Link im Text ergänzen; vorher prüfen, für welche flow_types
  `no_booking_*` und `no_show_24h` heute selektiert werden.
- `bewerbung.verbinden.tsx` bleibt vorerst bestehen (Altseiten), wird aber
  nicht mehr aus neuen Flows verlinkt.
- Danach: `bash scripts/deploy.sh` plus Landing-Sync.

## Prüfungen vor dem Abschluss

- Testbewerbung auf einer neuen Seite: Danke-Seite zeigt Terminauswahl im
  eigenen Design, Domain wechselt nicht sichtbar.
- Bestätigungs- und Erinnerungsmail kommen mit Absender der Bewerbungsseite.
- Eine bestehende Vermittlungsseite läuft unverändert durch (Regressionstest).
