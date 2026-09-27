# Pflicht-Ablauf nach der Registrierung: Vertrag, Ausweis, Einführung

## Was im Code zu sehen ist
Laut Ihrer Liste hängen fast alle neuen Mitarbeiter bei „Perso“. Sie haben weder einen Ausweis hochgeladen noch den Vertrag unterschrieben. Im Code finden sich dafür drei Gründe:

1. **Die Reihenfolge im Portal passt nicht zu Ihrer Liste.** Nach der Registrierung kommt man zuerst zum **Vertrag**, danach zum Ausweis. Ihre Liste zeigt dagegen zuerst „Perso“, dann „Vertrag“.
2. **Man kann die Vertragsseite einfach verlassen.** Oben gibt es einen Zurück-Pfeil zur Übersicht. In der Übersicht zwingt einen nichts zurück, dort ist nur ein kleiner Punkt im Menü. Hier bleiben die meisten vermutlich hängen.
3. **Die Onboarding-Sperre von heute stört den Ablauf.** Nach der Unterschrift soll man eigentlich zum Ausweis weitergehen. Die Sperre schickt einen aber direkt zur Einführung, und danach landet man in der Übersicht, ohne je einen Ausweis hochgeladen zu haben.

## Was sich ändert
Nach der Registrierung gibt es einen festen Weg, den man nicht verlassen kann:

```text
Registrierung -> Vertrag -> Ausweis (Perso) -> Einführung -> Übersicht
```

- Das Portal schickt jeden automatisch zum **ersten offenen Schritt**, auch wenn er die Übersicht oder einen anderen Menüpunkt direkt aufruft.
- Die Zurück-Pfeile zur Übersicht auf der Vertrags- und der Ausweisseite fallen weg. Das Blättern innerhalb eines Schritts bleibt.
- Oben auf beiden Seiten steht derselbe kurze Hinweis wie bei der Einführung: „Bitte nehmen Sie sich kurz Zeit für das Onboarding.“
- **Nach dem Hochladen gilt der Ausweis als erledigt.** Er wird eingereicht und geht in die Prüfung. Auf die Freigabe muss niemand warten, man kommt sofort weiter. Wird ein Ausweis abgelehnt, geht es wieder zurück zum Ausweis-Schritt.
- In Ihrer Mitarbeiter-Liste stehen die Schritte künftig in der echten Reihenfolge: Registriert, Vertrag, Perso, Freigegeben.
- Wer schon alles erledigt hat, merkt von der Änderung nichts. Sonst bleiben Design und Funktionen gleich.

## Fragen an den Teamleiter unterwegs
- Auf allen drei Seiten (Vertrag, Ausweis, Einführung) steht ein Kasten „Fragen? Schreiben Sie Ihrem Teamleiter“, mit Foto und Namen des Teamleiters. Ein Klick öffnet den bestehenden Mitarbeiterchat, ohne den Schritt zu verlassen.
- Beim Vertrag und beim Ausweis steht dazu ein kurzer Satz, der die üblichen Sorgen aufgreift, zum Beispiel „Wozu brauchen wir Ihren Ausweis?“ oder „Der Vertrag ist unverbindlich kündbar“. Das sind die Stellen, an denen Bewerber am häufigsten abspringen.
- Die Fortschrittsanzeige zeigt jederzeit „Schritt 1 von 3 · ca. 5 Minuten“, damit klar ist, wie wenig noch fehlt.

## Technische Details
- `EmployeeLayout.tsx`: Die bisherige Onboarding-Umleitung wird zu einer einzigen Umleitung in dieser Reihenfolge: `/contract` (ohne `contract_signed_at`), dann `/verification` (kein KYC-Eintrag, Status `nicht_gestartet` oder `abgelehnt`), dann `/onboarding` (nicht `abgeschlossen`). Ausgenommen sind der jeweilige Zielpfad und die Abmeldung. `eingereicht` und `in_pruefung` gelten als erledigt.
- `contract.tsx` und `verification.tsx`: Den `ArrowLeft`-Knopf zur Übersicht und das `onBack` zum Dashboard entfernen und die Hinweiszeile einfügen. Nach dem Ausweis führt `onNext` zu `/onboarding` statt zu `/dashboard`.
- `onboarding.tsx`: Fehlt ein Ausweis, leitet die Seite zu `/verification` weiter (so wie sie heute ohne Vertrag zu `/contract` weiterleitet).
- `admin.mitarbeiter.tsx`: Nur die Reihenfolge der Schritte in `stagesFor` ändert sich, die Daten bleiben dieselben.
- Der Teamleiter-Kasten nutzt die vorhandenen Teile `use-team-leader` und `TeamLeaderCard` und öffnet den `FloatingChat`. Die drei Pflichtseiten bekommen dafür eine gemeinsame Kopfzeile mit Schrittanzeige. Neue Tabellen braucht es nicht.
- Es gibt keine Datenbank-Änderung. Danach wird das Portal neu eingespielt.
- Diese Befehle für Ihren Datenbank-Server zeigen, wo die Leute wirklich hängen:
  `select count(*) filter (where contract_signed_at is null) ohne_vertrag, count(*) filter (where onboarding_status <> 'abgeschlossen') ohne_einfuehrung from profiles;`
