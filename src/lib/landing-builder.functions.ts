// Server-Funktionen für den Landing-Baukasten (Abschnitts-Editor).
// Nur Vorschau-Rendering; das Speichern läuft über saveLandingPage.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { renderSectionsLanding, SECTION_CATALOG, type LandingSection } from "@/lib/landing-sections";

const SectionSchema = z.object({
  id: z.string().max(60),
  type: z.string().max(40),
  data: z.record(z.string(), z.any()),
});

const InputSchema = z.object({
  sections: z.array(SectionSchema).max(40),
  // Branding wird 1:1 an den Renderer durchgereicht (Farben, Kontakt, Impressum …)
  branding: z.record(z.string(), z.any()).default({}),
  logo_url: z.string().max(500).nullable().optional(),
  /** Bearbeiten-Overlay in der Vorschau einblenden */
  editor: z.boolean().optional(),
});


async function requireAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error("Admin-Rechte erforderlich");
  }
}

export const renderSectionsPreview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => InputSchema.parse(raw ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await requireAdmin(supabase, userId);

    // Nur bekannte Abschnitts-Typen rendern
    const sections: LandingSection[] = data.sections
      .filter((s) => SECTION_CATALOG.some((d) => d.type === s.type))
      .map((s) => ({ id: s.id, type: s.type, data: s.data as Record<string, unknown> }));

    const html = renderSectionsLanding({
      sections,
      branding: data.branding,
      logoUrl: data.logo_url ?? undefined,
      editor: data.editor ?? false,
    });
    return { html };
  });


// ── KI-Assistent: Seitenentwurf & Bilder ─────────────────────────────────

const DraftInput = z.object({
  firmenname: z.string().max(120).default(""),
  branche: z.string().max(160).default(""),
  stelle: z.string().max(160).default(""),
  ort: z.string().max(120).default(""),
  tonalitaet: z.string().max(80).default("locker und persönlich"),
  designrichtung: z.string().max(160).default(""),
  besonderheiten: z.string().max(1500).default(""),
  /** nur Gestaltung neu würfeln, Texte behalten */
  onlyStyle: z.boolean().default(false),
});

const AI_SYSTEM = `Du bist Texter und Designer für deutsche Bewerber-Landingpages (Recruiting).
Du lieferst AUSSCHLIESSLICH ein JSON-Objekt, keinen Fließtext, keine Code-Zäune.

Regeln:
- Sprache: Deutsch, Ansprache per „Du", kurze Sätze, konkret statt werblich.
- Erfinde NIEMALS Zahlen, Auszeichnungen, Bewertungen, Kundenstimmen, Jahreszahlen oder Partnerfirmen.
- Keine Versprechen zu Gehalt oder Übernahme, wenn sie nicht in den Angaben stehen.
- Der Abschnitt "form" ist das Bewerbungsformular und hat keine Inhalte.

JSON-Form:
{
  "style": {
    "mode": "light" | "dark",
    "primary": "#rrggbb", "accent": "#rrggbb", "bg": "#rrggbb",
    "surface": "#rrggbb", "ink": "#rrggbb", "muted": "#rrggbb",
    "fontPair": "system" | "inter-plus" | "dm" | "serif" | "bold",
    "radius": 0-24, "density": "kompakt"|"normal"|"luftig",
    "buttonShape": "pill"|"rund"|"eckig"
  },
  "seo": { "title": "...", "description": "..." },
  "sections": [ { "type": "hero", "data": { ... } }, ... ]
}

Erlaubte Abschnittstypen und Felder:
- hero: kicker, title, subtitle, ctaText, variant ("split"|"centered"|"cover")
- stelle: title, location, salary, intro, tasks[], requirements[]
- ablauf: title, steps[{title, desc}]
- faq: title, items[{q, a}]
- kontakt: title, text, name, role, showWhatsapp, showPhone, showEmail
- freitext: title, text
- textbild: kicker, title, text, imageRight (true/false), ctaText, alt
- form: {}

Achte auf starken Kontrast zwischen ink und bg sowie zwischen primary und bg.
Baue 5 bis 8 Abschnitte, "form" genau einmal als letzten Abschnitt.`;

export const generateLandingDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => DraftInput.parse(raw ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await requireAdmin(supabase, userId);
    const { callAiJson } = await import("@/lib/landing-ai.server");
    const { createSection, normalizeStyle, randomStyle, SECTION_CATALOG: CAT } = await import("@/lib/landing-sections");

    if (data.onlyStyle) {
      return { style: randomStyle(), sections: null as any, seo: null as any };
    }

    const prompt = [
      `Firma: ${data.firmenname || "(nicht genannt)"}`,
      `Branche: ${data.branche || "(nicht genannt)"}`,
      `Gesuchte Stelle: ${data.stelle || "(nicht genannt)"}`,
      `Ort/Region: ${data.ort || "(nicht genannt)"}`,
      `Tonalität: ${data.tonalitaet}`,
      `Design-Richtung: ${data.designrichtung || "frei wählbar, seriös und modern"}`,
      `Besonderheiten (nur diese Fakten verwenden): ${data.besonderheiten || "keine"}`,
    ].join("\n");

    const out = await callAiJson(AI_SYSTEM, prompt);

    const style = normalizeStyle(out?.style);
    const rawSections = Array.isArray(out?.sections) ? out.sections : [];
    const sections: any[] = [];
    let hasForm = false;
    for (const s of rawSections.slice(0, 20)) {
      const type = String(s?.type || "");
      const def = CAT.find((d) => d.type === type);
      if (!def) continue;
      if (def.unique && sections.some((x) => x.type === type)) continue;
      if (type === "form") { hasForm = true; continue; }
      const base = createSection(type);
      const incoming = s?.data && typeof s.data === "object" ? s.data : {};
      const merged: Record<string, unknown> = { ...base.data };
      for (const f of def.fields) {
        if (Object.prototype.hasOwnProperty.call(incoming, f.key)) merged[f.key] = (incoming as any)[f.key];
      }
      sections.push({ ...base, data: merged });
    }
    // Sicherheitsnetz: ohne Formular bringt eine Landing nichts.
    if (hasForm || true) sections.push(createSection("form"));

    return {
      style,
      sections,
      seo: {
        title: String(out?.seo?.title || "").slice(0, 300),
        description: String(out?.seo?.description || "").slice(0, 600),
      },
    };
  });

const ImageInput = z.object({
  prompt: z.string().min(3).max(800),
});

export const generateLandingImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => ImageInput.parse(raw ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await requireAdmin(supabase, userId);
    const { generateAiImage } = await import("@/lib/landing-ai.server");
    const url = await generateAiImage(
      `${data.prompt}\n\nStil: professionelle, realistische Werbefotografie für eine deutsche Recruiting-Webseite. Kein Text, keine Logos, keine Wasserzeichen im Bild.`
    );
    return { url };
  });
