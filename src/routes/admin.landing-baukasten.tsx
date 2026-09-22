import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listLandingPages,
  getLandingPage,
  saveLandingPage,
} from "@/lib/landing-pages.functions";
import { renderSectionsPreview } from "@/lib/landing-builder.functions";
import {
  SECTION_CATALOG,
  defaultSections,
  createSection,
  type LandingSection,
  type SectionField,
} from "@/lib/landing-sections";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Save, Eye, ArrowUp, ArrowDown, Trash2, Plus, Layers, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/landing-baukasten")({
  component: LandingBaukastenPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center space-y-4">
      <h2 className="text-xl font-bold text-destructive">Baukasten konnte nicht geladen werden</h2>
      <p className="text-muted-foreground">{String((error as Error)?.message || error)}</p>
      <Button onClick={() => window.location.reload()}>Erneut versuchen</Button>
    </div>
  ),
});

type LandingRow = {
  id: string;
  slug: string;
  theme_id: string;
  flow_type?: string;
  source_slug?: string;
  is_published?: boolean;
  booking_mode?: string;
  calendly_url?: string | null;
  branding?: Record<string, unknown> | null;
  slots?: Record<string, string> | null;
  sections?: LandingSection[] | null;
  logo_url?: string | null;
};

type LandingListItem = {
  id: string;
  slug: string;
  branding?: unknown;
  is_published?: boolean;
};

function LandingBaukastenPage() {
  const { toast } = useToast();
  const listFn = useServerFn(listLandingPages);
  const getFn = useServerFn(getLandingPage);
  const saveFn = useServerFn(saveLandingPage);
  const previewFn = useServerFn(renderSectionsPreview);

  const [landings, setLandings] = useState<LandingListItem[]>([]);
  const [current, setCurrent] = useState<LandingRow | null>(null);
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [branding, setBranding] = useState<Record<string, any>>({
    firmenname: "", primary_color: "#2563eb", secondary_color: "#1e40af",
    kontakt_email: "", telefon: "", seo_title: "", seo_description: "",
  });
  const [slug, setSlug] = useState("");
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [addType, setAddType] = useState(SECTION_CATALOG[0].type);

  const refreshList = useCallback(async () => {
    const res = (await listFn()) as unknown as { rows: LandingListItem[] };
    setLandings(res.rows || []);
  }, [listFn]);

  useEffect(() => {
    (async () => {
      try {
        await refreshList();
      } catch (e) {
        toast({ title: "Fehler", description: String((e as Error).message), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLanding = useCallback(async (id: string) => {
    try {
      const lp = (await getFn({ data: { id } })) as unknown as LandingRow;
      setCurrent(lp);
      setSlug(lp.slug || "");
      setCalendlyUrl(lp.calendly_url || "");
      setBranding({ telefon: "", kontakt_email: "", ...(lp.branding || {}) });
      setSections(
        Array.isArray(lp.sections) && lp.sections.length
          ? (lp.sections as LandingSection[])
          : defaultSections()
      );
      setPreviewHtml("");
    } catch (e) {
      toast({ title: "Laden fehlgeschlagen", description: String((e as Error).message), variant: "destructive" });
    }
  }, [getFn, toast]);

  const newLanding = () => {
    setCurrent(null);
    setSlug("");
    setCalendlyUrl("");
    setBranding({ firmenname: "", primary_color: "#2563eb", secondary_color: "#1e40af", kontakt_email: "", telefon: "", seo_title: "", seo_description: "" });
    setSections(defaultSections());
    setPreviewHtml("");
  };

  // ── Abschnitte bearbeiten ────────────────────────────────────────────────
  const updateSection = (id: string, patch: Record<string, unknown>) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, data: { ...s.data, ...patch } } : s)));

  const moveSection = (id: string, dir: -1 | 1) =>
    setSections((prev) => {
      const i = prev.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const removeSection = (id: string) => setSections((prev) => prev.filter((s) => s.id !== id));

  const addSection = () => {
    const def = SECTION_CATALOG.find((d) => d.type === addType);
    if (!def) return;
    if (def.unique && sections.some((s) => s.type === def.type)) {
      toast({ title: "Nur einmal möglich", description: `„${def.label}" kann nur einmal vorkommen.`, variant: "destructive" });
      return;
    }
    setSections((prev) => [...prev, createSection(def.type)]);
  };

  // ── Vorschau ─────────────────────────────────────────────────────────────
  const refreshPreview = async () => {
    setPreviewing(true);
    try {
      const res = await previewFn({
        data: {
          sections,
          branding: {
            firmenname: branding.firmenname, primary_color: branding.primary_color,
            secondary_color: branding.secondary_color, kontakt_email: branding.kontakt_email,
            telefon: branding.telefon, whatsapp_number: branding.whatsapp_number,
            impressum: branding.impressum, datenschutz: branding.datenschutz,
            seo_title: branding.seo_title, seo_description: branding.seo_description,
          },
          logo_url: current?.logo_url || null,
        },
      });
      setPreviewHtml(res.html);
    } catch (e) {
      toast({ title: "Vorschau fehlgeschlagen", description: String((e as Error).message), variant: "destructive" });
    } finally {
      setPreviewing(false);
    }
  };

  // ── Speichern ────────────────────────────────────────────────────────────
  const save = async () => {
    if (!slug.trim()) {
      toast({ title: "Slug fehlt", description: "Bitte einen Slug (Kurzname) vergeben.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        slug: slug.trim(),
        theme_id: current?.theme_id || "theme-10",
        flow_type: current?.flow_type || "fast",
        source_slug: current?.source_slug || "",
        is_published: current?.is_published ?? false,
        booking_mode: current?.booking_mode || "calendly",
        calendly_url: calendlyUrl,
        branding,
        slots: current?.slots || {},
        sections,
      };
      if (current?.id) payload.id = current.id;
      const res = (await saveFn({ data: payload as any })) as any;
      const newId = res?.id || current?.id;
      toast({ title: "Gespeichert", description: "Landing-Seite wurde gespeichert." });
      await refreshList();
      if (newId) await loadLanding(newId);
    } catch (e) {
      const msg = String((e as Error).message);
      toast({
        title: "Speichern fehlgeschlagen",
        description: msg.includes("sections")
          ? "Die Datenbank kennt das Feld „sections“ noch nicht — bitte zuerst die Migration supabase/manual-migrations/20260922000000_landing_sections.sql einspielen."
          : msg,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Layers className="h-6 w-6" /> Landing-Baukasten</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Seiten frei aus Abschnitten zusammenstellen — ohne festes Design. Bestehende Seiten bleiben unverändert, bis du sie hier lädst und speicherst.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/landing-generator">
            <Button variant="outline" size="sm">Zum klassischen Generator</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={newLanding}><Plus className="h-4 w-4 mr-1" /> Neue Seite</Button>
        </div>
      </div>

      {/* Auswahl */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Landing-Seite wählen</CardTitle>
          <CardDescription>Seiten mit Abschnitten öffnen sich im Baukasten-Modus; klassische Seiten bekommen beim ersten Speichern eine Startvorlage.</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            className="w-full border rounded-md px-3 py-2 bg-background"
            value={current?.id || ""}
            onChange={(e) => (e.target.value ? loadLanding(e.target.value) : newLanding())}
          >
            <option value="">— Neue Seite anlegen —</option>
            {landings.map((l) => (
              <option key={l.id} value={l.id}>
                {((l.branding as any)?.firmenname as string) || l.slug} ({l.slug}){l.is_published ? " · online" : ""}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Grundeinstellungen */}
      <Card>
        <CardHeader><CardTitle className="text-base">Grundeinstellungen</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Firmenname</Label>
            <Input value={branding.firmenname || ""} onChange={(e) => setBranding({ ...branding, firmenname: e.target.value })} />
          </div>
          <div>
            <Label>Slug (Kurzname, z. B. firma-stadt)</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
          </div>
          <div>
            <Label>Hauptfarbe</Label>
            <div className="flex gap-2">
              <input type="color" className="h-9 w-12 rounded border" value={branding.primary_color || "#2563eb"} onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })} />
              <Input value={branding.primary_color || ""} onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Akzentfarbe</Label>
            <div className="flex gap-2">
              <input type="color" className="h-9 w-12 rounded border" value={branding.secondary_color || "#1e40af"} onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })} />
              <Input value={branding.secondary_color || ""} onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Kontakt-E-Mail (im Bewerbungsformular)</Label>
            <Input value={branding.kontakt_email || (branding.email as string) || ""} onChange={(e) => setBranding({ ...branding, kontakt_email: e.target.value })} />
          </div>
          <div>
            <Label>Telefon (im Bewerbungsformular)</Label>
            <Input value={branding.telefon || ""} onChange={(e) => setBranding({ ...branding, telefon: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Calendly-Link (für die Terminbuchung nach der Bewerbung)</Label>
            <Input value={calendlyUrl} onChange={(e) => setCalendlyUrl(e.target.value)} placeholder="https://calendly.com/…" />
          </div>
          <div>
            <Label>Browser-Titel (SEO)</Label>
            <Input value={branding.seo_title || ""} onChange={(e) => setBranding({ ...branding, seo_title: e.target.value })} />
          </div>
          <div>
            <Label>Beschreibung (SEO)</Label>
            <Input value={branding.seo_description || ""} onChange={(e) => setBranding({ ...branding, seo_description: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* Abschnitte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Abschnitte ({sections.length})</CardTitle>
          <CardDescription>Reihenfolge mit den Pfeilen ändern, Inhalte direkt in den Feldern bearbeiten.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.map((s, idx) => (
            <SectionEditor
              key={s.id}
              section={s}
              index={idx}
              total={sections.length}
              onChange={(patch) => updateSection(s.id, patch)}
              onMove={(dir) => moveSection(s.id, dir)}
              onRemove={() => removeSection(s.id)}
            />
          ))}

          <div className="flex gap-2 pt-2 border-t">
            <select className="border rounded-md px-3 py-2 bg-background flex-1" value={addType} onChange={(e) => setAddType(e.target.value)}>
              {SECTION_CATALOG.map((d) => (
                <option key={d.type} value={d.type} disabled={d.unique && sections.some((s) => s.type === d.type)}>
                  {d.label}{d.unique ? " (1×)" : ""}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={addSection}><Plus className="h-4 w-4 mr-1" /> Hinzufügen</Button>
          </div>
        </CardContent>
      </Card>

      {/* Aktionen + Vorschau */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Speichern
        </Button>
        <Button variant="outline" onClick={refreshPreview} disabled={previewing}>
          {previewing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
          Vorschau aktualisieren
        </Button>
        {current?.is_published && (branding.landing_domain as string) && (
          <a href={`https://${branding.landing_domain as string}`} target="_blank" rel="noreferrer" className="inline-flex">
            <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4 mr-1" /> Live-Seite</Button>
          </a>
        )}
      </div>

      {previewHtml && (
        <Card>
          <CardHeader><CardTitle className="text-base">Vorschau</CardTitle></CardHeader>
          <CardContent>
            <iframe title="Vorschau" srcDoc={previewHtml} className="w-full h-[70vh] rounded-md border bg-white" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Einzelner Abschnitt im Editor ────────────────────────────────────────────

function SectionEditor({
  section, index, total, onChange, onMove, onRemove,
}: {
  section: LandingSection;
  index: number;
  total: number;
  onChange: (patch: Record<string, unknown>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const def = SECTION_CATALOG.find((d) => d.type === section.type);
  if (!def) return null;
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium text-sm">
          {index + 1}. {def.label}
          <span className="text-muted-foreground font-normal ml-2 text-xs">{def.description}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => onMove(-1)}><ArrowUp className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" disabled={index === total - 1} onClick={() => onMove(1)}><ArrowDown className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onRemove}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {def.fields.map((f) => (
          <FieldEditor
            key={f.key}
            field={f}
            value={section.data[f.key]}
            onChange={(v) => onChange({ [f.key]: v })}
          />
        ))}
      </div>
    </div>
  );
}

function FieldHint({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-xs text-muted-foreground mt-1">{text}</p>;
}

function FieldEditor({ field, value, onChange }: { field: SectionField; value: unknown; onChange: (v: unknown) => void }) {
  const wide = field.kind === "textarea" || field.kind === "strings" || field.kind === "objects";
  return (
    <div className={cn(wide && "md:col-span-2")}>
      {field.kind !== "boolean" && <Label className="text-xs">{field.label}</Label>}
      {field.kind === "text" && (
        <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
      )}
      {field.kind === "textarea" && (
        <Textarea rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
      )}
      {field.kind === "color" && (
        <div className="flex gap-2">
          <input type="color" className="h-9 w-12 rounded border" value={String(value || "#f1f5f9")} onChange={(e) => onChange(e.target.value)} />
          <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </div>
      )}
      {field.kind === "boolean" && (
        <label className="flex items-center gap-2 text-sm mt-1">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      )}
      {field.kind === "strings" && (
        <Textarea
          rows={4}
          value={(Array.isArray(value) ? (value as string[]) : []).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
          placeholder="Eine Zeile = ein Punkt"
        />
      )}
      {field.kind === "image" && (
        <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
      )}
      {field.kind === "objects" && (
        <ObjectsField field={field} value={Array.isArray(value) ? (value as Record<string, string>[]) : []} onChange={onChange} />
      )}
      <FieldHint text={field.help} />
    </div>
  );
}

function ObjectsField({
  field, value, onChange,
}: {
  field: SectionField;
  value: Record<string, string>[];
  onChange: (v: unknown) => void;
}) {
  const itemFields = field.itemFields || [];
  const setItem = (i: number, key: string, v: string) => {
    const next = value.map((it, idx) => (idx === i ? { ...it, [key]: v } : it));
    onChange(next);
  };
  return (
    <div className="space-y-2 mt-1">
      {value.map((item, i) => (
        <div key={i} className="border rounded-md p-3 bg-background space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{field.itemLabel || "Eintrag"} {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
          {itemFields.map((inf) => (
            <div key={inf.key}>
              <Label className="text-xs">{inf.label}</Label>
              {inf.kind === "textarea" ? (
                <Textarea rows={2} value={String(item[inf.key] ?? "")} onChange={(e) => setItem(i, inf.key, e.target.value)} />
              ) : (
                <Input value={String(item[inf.key] ?? "")} onChange={(e) => setItem(i, inf.key, e.target.value)} placeholder={inf.kind === "image" ? "https://…" : undefined} />
              )}
            </div>
          ))}
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, Object.fromEntries(itemFields.map((f) => [f.key, ""]))])}
      >
        <Plus className="h-3.5 w-3.5 mr-1" /> {field.itemLabel || "Eintrag"} hinzufügen
      </Button>
    </div>
  );
}
