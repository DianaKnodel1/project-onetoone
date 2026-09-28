# Gespeicherte Vorlagen im klassischen Landinggenerator verwenden

## Ziel
Eine im Landing-Baukasten gespeicherte Vorlage wird im klassischen Landinggenerator direkt als Ausgangspunkt geladen. Die Seite bleibt dabei jederzeit im klassischen Generator; der Baukasten wird weder geöffnet noch als Zwischenschritt verwendet.

Im klassischen Generator bleiben anschließend **Firmendaten und Farben** bearbeitbar. Die gespeicherten Abschnittsinhalte, Bilder und deren Reihenfolge werden vollständig aus der Vorlage übernommen und beim Anlegen der neuen Landingpage verwendet.

## Umsetzung
1. **Vorlagenwahl direkt im Generator absichern**
   - Alle Aktionen „Vorlage verwenden“ im klassischen Generator als interne Auswahl behandeln.
   - Eventuelle Links oder Navigationen zum Landing-Baukasten aus diesem Vorlagen-Flow entfernen.
   - Die gewählte Vorlage anhand ihrer ID aus den bereits geladenen Vorlagendaten übernehmen.

2. **Vorlage vollständig in den Generatorzustand laden**
   - Abschnitte, Texte, Bilder, Reihenfolge und gespeicherten Stil als Ausgangsbasis setzen.
   - Die Live-Vorschau direkt im klassischen Generator mit dieser Vorlage aktualisieren.
   - Vorlagenfarben in die vorhandenen Farbfelder übernehmen und weitere Farbänderungen sofort in Vorschau und Speicherung berücksichtigen.
   - Firmenname, Kontakt-, Domain- und sonstige Firmendaten weiterhin ausschließlich über die bestehenden Generatorfelder pflegen.

3. **Saubere Trennung der Arbeitszustände**
   - Beim Wechsel auf ein normales Theme die Vorlagenauswahl vollständig aufheben.
   - Beim Bearbeiten einer bestehenden Landingpage oder beim Start einer neuen leeren Landing keine zuvor gewählte Vorlage ungewollt weiterverwenden.
   - Das Vorlagen-Original unverändert lassen; beim Speichern entstehen neue Abschnitts-IDs für die neue Landingpage.

4. **Speichern über den bestehenden klassischen Ablauf**
   - „Speichern & live schalten“ verwendet bei aktiver Vorlage deren Abschnitte und den im Generator angepassten Stil.
   - Ohne gewählte Vorlage bleibt der bisherige Theme-Ablauf unverändert.
   - Bestehende Landingpages und die Funktionen des Baukastens werden nicht verändert.

5. **Prüfung**
   - Mit einer gespeicherten Vorlage testen: auswählen, URL/Seite bleibt klassischer Generator, Inhalte erscheinen in der Vorschau.
   - Firmenname und Farben ändern und prüfen, dass die Vorschau reagiert.
   - Als neue Landingpage speichern und kontrollieren, dass Abschnitte, Bilder, Texte und angepasste Farben übernommen wurden.
   - Danach normales Theme, neue Landing und bestehende Landing prüfen, damit keine alte Vorlagenauswahl hängen bleibt.

## Technische Begrenzung
Keine neue Oberfläche, keine neuen Komponenten und keine Änderung am Baukasten. Angepasst wird nur die Auswahl-, Zustands-, Vorschau- und Speicherlogik des bestehenden klassischen Generators.
