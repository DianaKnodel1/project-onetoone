# Bilderzeugung im Landing-Baukasten reparieren

## Befund

Der Baukasten bevorzugt apinet.cloud, sobald dort ein Schlüssel hinterlegt ist. Die Bilderzeugung ruft dort aber die Google-Gemini-Schnittstelle (`generateContent`, Modell `gemini-2.5-flash-image`) auf. apinet.cloud ist OpenAI-kompatibel und kennt dieses Format sehr wahrscheinlich nicht — daher die 400-Antwort. Der Schlüssel ist vermutlich gültig; das Anfrageformat passt nicht zum Dienst.

## Vorgehen

1. **Verifizieren, was apinet.cloud kann:** Einmal serverseitig prüfen, ob apinet ein Bildmodell anbietet (Modell-Liste abrufen bzw. eine Testanfrage im OpenAI-Bildformat stellen). Ergebnis entscheidet den Weg.
2. **Fall A — apinet kann Bilder:** `generateAiImage` in `src/lib/landing-ai.server.ts` so umbauen, dass bei apinet das OpenAI-Bildformat (`/v1/images/generations` oder Chat-Completions mit Bildmodell, je nachdem was apinet anbietet) genutzt wird. Texte bleiben unverändert.
3. **Fall B — apinet kann keine Bilder:** Bilderzeugung läuft immer über den Gemini-Zugang (`gemini_api_key`), Texte bleiben bei apinet. Fehlt der Gemini-Schlüssel, zeigt der Baukasten eine verständliche Meldung: „Für KI-Bilder bitte einen Gemini-Schlüssel in den KI-Einstellungen hinterlegen."
4. **Keine stillschweigende Modell-Umschaltung:** Das Bildmodell wird nur angepasst, wenn die Prüfung in Schritt 1 ein unterstütztes Bildmodell bestätigt.
5. **Test:** Einen Bildversuch im Baukasten bis zur sichtbaren Vorschau durchspielen.

## Technische Details

- Betroffen: `src/lib/landing-ai.server.ts` (`generateAiImage`, `loadAiCreds`), Aufrufer `generateLandingImage` in `src/lib/landing-builder.functions.ts`.
- Zugangsdaten kommen aus `system_settings` (id=1): `apinet_api_key` bevorzugt, `gemini_api_key` als Fallback.
- Kein Eingriff in Textgenerierung, Bewerberfluss oder WebID.
- Deploy danach: `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`.
