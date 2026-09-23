# Landing-Daten automatisch ins Mitarbeiterportal übernehmen

## Ziel
Anmeldung und Registrierung unter der im Landing-Generator eingetragenen Portal-Domain zeigen immer die passende Firma. Firmenname, Logo, Kontakt-E-Mail und ausgewähltes Portal-Design stammen aus derselben Landingseite.

## Umsetzung
- Beim Speichern einer Landingseite mit zugeordnetem Unternehmen die Portal-Angaben automatisch synchronisieren:
  - Firmenname
  - hochgeladenes Logo
  - Kontakt-E-Mail
  - Primärfarbe
  - Portal-Design
  - Portal-Domain als erlaubte Domain-Zuordnung
- Die öffentliche Unternehmenszuordnung so erweitern, dass Login und Registrierung die Kontakt-E-Mail zuverlässig lesen können.
- Die feste Ersatzadresse `support@cac-vermittlung.de` aus der Registrierung entfernen. Ohne gepflegte Kontakt-E-Mail erscheint stattdessen nur der neutrale Hinweis auf den Ansprechpartner.
- Anmeldung und Registrierung verwenden weiterhin dieselbe zentrale Unternehmensauflösung anhand der aufgerufenen Portal-Domain.

## Bestehende Seiten
Bereits gespeicherte Landingseiten werden beim nächsten Speichern synchronisiert. Bestehende Unternehmensdaten werden nur für das ausgewählte Unternehmen aktualisiert.

## Prüfung
- Landingseite mit Firmenname, Logo, Kontakt-E-Mail und Portal-URL speichern.
- Die zugehörige `/login`- und `/register`-Seite öffnen.
- Prüfen, dass Logo/Firmenname und Kontakt-E-Mail übereinstimmen und keine fremde Ersatzadresse erscheint.
