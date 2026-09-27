# Landing Generator: Bilderzeugung prüfen und Kurz-Anleitung erstellen

## Ziel

Den Fehler bei „Mit KI erzeugen“ anhand des geteilten Screenshots eingrenzen und beheben; anschließend eine **einseitige, schön gestaltete PDF-Anleitung** für den Kollegen erstellen, die nur das Anlegen einer neuen Seite beschreibt.

## Bilderzeugung

- Die Fehlermeldung im Screenshot zeigt eine Antwort mit Status 400 vom Bilddienst. Daraus allein folgt **nicht**, dass der Schlüssel ungültig ist.
- Prüfen, welche sichere vollständige Fehlermeldung der Dienst zurückgibt und ob der hinterlegte Zugang das fest eingestellte Bildmodell unterstützt. Der Code bevorzugt derzeit apinet, sobald dort ein Schlüssel hinterlegt ist; das Bildmodell ist unabhängig vom eingestellten Textmodell festgelegt.
- Nur den bestätigten Fehler beheben: etwa die Anfrage an das unterstützte Bildmodell anpassen oder im Baukasten verständlich auf fehlende Berechtigung hinweisen. Keine stillschweigende Umschaltung auf einen anderen Zugang oder ein anderes Modell.
- Einen Bildversuch mit Admin-Zugang bis zur sichtbaren Vorschau prüfen; falls der Zugang beim Bilddienst nicht freigeschaltet ist, die konkrete Freischaltung als offenen Punkt nennen.

## Einseitiges PDF

- Kurzer, bebilderungsfreier Spickzettel auf Deutsch: Admin → Landing-Baukasten → „Neue Seite“ → „Komplette Seite in einem Schritt erstellen“ → Vorlage, Firmenname, Branche, Stelle und echte Stichworte → „Seite generieren“.
- Danach Texte und Bilder kontrollieren, bei Bedarf Bild hochladen oder nach erfolgreicher Fehlerbehebung per KI erzeugen, Grundeinstellungen einschließlich Kontakt und Calendly prüfen, Vorschau auf Handy/Desktop ansehen und speichern.
- Den Schritt zum Live-Schalten **vor dem Druck anhand des tatsächlichen Speicher- und Veröffentlichungswegs verifizieren**. Der Baukasten speichert neue Seiten derzeit ohne Domain und zunächst pausiert; die Anleitung darf nicht behaupten, dass ein Klick auf „Speichern“ die Seite schon veröffentlicht. Domain-Zuweisung und Aktivierung nur mit tatsächlich funktionierendem Ablauf beschreiben.
- PDF unter `/mnt/documents/landing-generator-anleitung.pdf` ausgeben, als A4-Seite rendern und visuell auf Lesbarkeit, Abstände und Überlappungen prüfen.

## Technische Details

- Betroffene Stellen: `src/lib/landing-ai.server.ts`, `src/lib/landing-builder.functions.ts` und Bildfeld in `src/routes/admin.landing-baukasten.tsx`; zur Veröffentlichung auch `src/lib/landing-pages.functions.ts` und die beiden Admin-Seiten prüfen.
- Die neue Prüfaufgabe in `roadmap.md` festhalten und nach Abschluss aktualisieren; keine Änderung an bestehendem Landing- oder Bewerberfluss ohne bestätigte Ursache.
