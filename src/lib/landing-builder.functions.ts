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

