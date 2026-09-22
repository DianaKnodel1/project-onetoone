# Fix: Landing-Baukasten meldet „Admin-Rechte erforderlich“ obwohl Admin angemeldet

## Ursache (bestätigt)
- `src/lib/landing-builder.functions.ts` prüft die Admin-Rolle über
  `profiles.role` — die Tabelle `profiles` hat aber gar keine Spalte `role`.
  Rollen liegen in `user_roles` (Enum `app_role`). Dadurch schlägt die Prüfung
  immer fehl → „Admin-Rechte erforderlich“, Vorschau bleibt leer.
- Alle anderen Server-Funktionen (14 Stück, geprüft) nutzen bereits korrekt
  `user_roles` — nur `landing-builder.functions.ts` ist betroffen. Derselbe
  Fehler war zuvor schon in der Migration `20260922010000` aufgetreten und dort
  repariert worden.

## Änderung
- `requireAdmin()` in `src/lib/landing-builder.functions.ts` auf die
  projektübliche Prüfung umstellen (identisch zu `employee-block.functions.ts`):

```text
const { data, error } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", userId)
  .eq("role", "admin")
  .maybeSingle();
if (error) throw new Error(error.message);
if (!data) throw new Error("Admin-Rechte erforderlich");
```

- Baukasten bleibt bewusst Admin-only (wie vereinbart), `admin_mitarbeiter`
  bekommt keinen Zugriff.

## Verifikation
- `bunx tsgo --noEmit` muss grün sein.
- Keine weiteren `from("profiles").select("role")`-Stellen im Code (bereits
  geprüft: keine).

## Deploy
- `git push`, dann auf dem Server:
  `cd /opt/apps/portal && git pull && bash scripts/deploy.sh`
- Danach Landing-Baukasten neu laden: Seiten lassen sich wählen/erstellen,
  Vorschau rendert, kein „Admin-Rechte erforderlich“ mehr.

## Anschließend (aus dem bisherigen Verifikationsplan)
- Prüfungen/Termine/Mitarbeiter: echte Namen statt „Unbekannt“.
- SIM-Modul: Nummer hinzufügen, Zuweisen/Entziehen, Auto-Refresh.
- Sperren/Freigeben: rotes Badge, durchgestrichener Name, neutraler Login-Fehler.
- „Landing-Server-Sync verzögert.“ aus dem letzten Deploy: nur falls Landing-
  Änderungen auf .152 nicht sichtbar sind, `bash scripts/sync-landing-server.sh`.
