# Mehr wahrgenommene Termine, mehr abgeschlossene Registrierungen

Die Nachfass-Liste im Admin ist gestrichen. Ich habe stattdessen den
kompletten Weg noch einmal im Code durchgesehen. Ergebnis: an drei Stellen
verspricht das Portal etwas, das es nicht mehr hält, und an zwei Stellen
ist der Weg länger als nötig.

## Was ich gefunden habe

**1. Das Portal verspricht E-Mails, die nie ankommen.**
Der eigene Mailversand ist doppelt abgeriegelt (Cron-Jobs entfernt,
zusätzlich harter Riegel im Code). Trotzdem steht auf den Terminseiten:
„Sie erhalten nach der Buchung eine Bestätigung per E-Mail – inklusive
Kalendereintrag" und „Sie erhalten den Link rund 30 Minuten vor dem Termin
per E-Mail". Wer über Calendly bucht, bekommt die Mail von Calendly; wer
über die eigene Terminseite bucht, wartet vergeblich und erscheint nicht.

**2. Es gibt keinen Kalendereintrag aus dem eigenen System.**
Kein Termin im Handy-Kalender heißt: keine Erinnerung, kein Klingeln
15 Minuten vorher. Das ist der größte einzelne Hebel gegen Nichterscheinen.

**3. Der Gesprächslink ist nach dem Schließen des Tabs weg.**
Er steht nur in der Mail (die nicht kommt) bzw. auf der Seite selbst.

**4. Das Passwort steht ganz am Anfang der Registrierung.**
Das Konto wird technisch erst nach dem letzten Schritt angelegt – das
Passwortfeld steht aber schon in Schritt 1 und wirkt wie eine Mauer direkt
nach der Zusage.

**5. Die Registrierung hat einen Schritt zu viel.**
„Adresse" und „Wohndauer / vorherige Adresse" sind zwei getrennte Seiten,
obwohl es dieselbe Sache ist.

**6. Nach der Registrierung kommt die eigentliche Hürde.**
Vertrag unterschreiben, Ausweis hochladen und IBAN eintragen sind alles
Pflicht-Tore, bevor überhaupt etwas passiert. Wer am Ausweis-Upload
scheitert (Handy, Kamera, Dateigröße), bleibt für immer stecken.

## Was ich optimieren würde

### Stufe 1 – Termin wirklich wahrnehmen

1. **Termin in den Kalender**: Auf der Bestätigungsseite ein Knopf
   „Termin in meinen Kalender" (erzeugt den Eintrag direkt, funktioniert
   auf iPhone, Android und Outlook). Damit erinnert das Handy von selbst.
2. **Gesprächslink dauerhaft sichtbar**: Der Link wird im Browser gemerkt
   und beim erneuten Öffnen der Terminseite sofort wieder angezeigt – plus
   Knopf „Link per WhatsApp an mich schicken", damit er auf dem Handy liegt.
3. **Ehrliche Texte**: Überall dort, wo heute „Sie erhalten eine E-Mail"
   steht, kommt der tatsächliche Weg hin – bei Calendly-Buchungen der
   Hinweis auf Calendly, sonst „alles steht hier auf dieser Seite".
4. **Countdown statt Stille**: Auf der Terminseite „Ihr Gespräch beginnt in
   … " und ein großer Knopf, der zur Startzeit aktiv wird.

### Stufe 2 – Nach der Zusage wirklich registrieren

5. **Passwort ans Ende**: Zuerst nur der Name (bereits vorausgefüllt), das
   Passwort erst im letzten Schritt, direkt vor dem Abschicken. Der
   Einstieg kostet dann null Überwindung.
6. **Vier Schritte statt fünf**: Adresse und Wohndauer auf einer Seite.
7. **Wiedereinstieg sichtbar machen**: Angefangene Registrierungen werden
   schon gespeichert – beim erneuten Öffnen begrüßt eine Zeile „Weiter, wo
   Sie aufgehört haben (Schritt 3 von 4)" statt eines leeren Formulars.
8. **Abschluss-Seite ohne Mail-Versprechen**: Im mailfreien Betrieb ist das
   Konto sofort aktiv – die Seite „Wir haben dir eine Bestätigungsmail
   geschickt" darf dort gar nicht mehr erscheinen.

### Stufe 3 – Nach der Registrierung nicht steckenbleiben

9. **Ausweis-Notausgang**: Beim Ausweis-Schritt ein Hinweis „Kein Upload
   möglich? Foto einfach per WhatsApp schicken" – das ist die technisch
   heikelste Stelle im ganzen Ablauf.
10. **IBAN nicht als Sperre**: Vertrag und Ausweis bleiben Pflicht, die
    Bankverbindung darf man nachreichen, statt den Zugang zu blockieren.

## Nicht Teil davon

- Keine Wiederbelebung eigener E-Mails.
- Keine Nachfass-Liste im Admin.
- SMS-Versand: technisch nicht vorhanden (die SIM-Nummern können nur
  empfangen), also kein Erinnerungskanal.
- Am Gesprächsablauf und an der KI-Bewertung ändert sich nichts.

## Technisch kurz

- Kalendereintrag: `.ics` im Browser erzeugt (kein Server nötig), Knopf in
  `src/routes/termin.buchen.$token.tsx` (BookingConfirmed),
  `src/routes/termin.$token.tsx` und in der Danke-Karte
  `src/landing-themes/_shared/form-section.js`.
- Termin-/Gesprächslink in `localStorage` merken, Countdown in
  `termin.$token.tsx`; WhatsApp-Knopf über `use-whatsapp-support.ts`.
- Texte in `termin.buchen.$token.tsx:314,362-374`, `termin.$token.tsx:324`
  und `form-section.js` an den tatsächlichen Kanal anpassen.
- Registrierung: `StepAccount` ohne Passwort, neues Passwortfeld in
  `StepEmployment` (letzter Schritt), `StepAddress` + `StepLivingSince`
  zusammenlegen, `WizardProgress` auf vier Schritte, Wiedereinstiegs-Hinweis
  aus dem vorhandenen `onboarding_wizard_draft`.
- `register.tsx`: Schritt 99 im mailfreien Betrieb überspringen.
- Ausweis-Hinweis in `src/components/register/StepIdentity.tsx` bzw. im
  Portal-Onboarding; IBAN-Gate in `src/routes/_employee/onboarding.tsx`
  lockern.
- Prüfung `bunx tsgo --noEmit`, Renderer neu bauen; Deploy
  `git pull && bash scripts/deploy.sh`, danach
  `bash scripts/sync-landing-server.sh`.
