import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, ShieldAlert, ExternalLink, Copy, Send } from "lucide-react";

export const Route = createFileRoute("/admin/webid-sim")({
  component: WebIdSimPage,
  head: () => ({
    meta: [
      { title: "WebID-Simulation – Admin" },
      { name: "description", content: "Simulationsdomains, Vorgänge und Zuweisungen für die WebID-Umgebung verwalten." },
      { property: "og:title", content: "WebID-Simulation – Admin" },
      { property: "og:description", content: "Simulationsdomains, Vorgänge und Zuweisungen für die WebID-Umgebung verwalten." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type SimMode = "simulation" | "tunnel";
interface SimDomain {
  id: string;
  domain: string;
  display_name: string;
  target_origin: string;
  logo_url: string | null;
  topbar_text: string;
  is_active: boolean;
  allow_submit: boolean;
  mode: SimMode;
  notes: string | null;
}
interface Procedure {
  id: string;
  key: string;
  label: string;
  provider: "webid" | "postident";
  title: string;
  body: string;
  meta: string | null;
  allow_submit: boolean;
  is_active: boolean;
}
interface Assignment {
  id: string;
  individual_case_number: string | null;
  webid_client_name: string | null;
  webid_procedure_key: string | null;
  user_id: string;
}

function WebIdSimPage() {
  return (
    <div className="space-y-6 p-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" /> WebID-Simulation
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Registrierte Domains, Vorgänge (Hinweis-Texte) und Zuweisungen zu Aufträgen.
          Pro Domain wählbar: <strong>Simulation</strong> (Overlay, Submits blockiert) oder
          <strong> Tunnel</strong> (echter Durchgang, Overlay bleibt oben).
        </p>
      </div>

      <Tabs defaultValue="domains" className="w-full">
        <TabsList>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="procedures">Vorgänge</TabsTrigger>
          <TabsTrigger value="assignments">Zuweisungen</TabsTrigger>
        </TabsList>
        <TabsContent value="domains" className="mt-4"><DomainsTab /></TabsContent>
        <TabsContent value="procedures" className="mt-4"><ProceduresTab /></TabsContent>
        <TabsContent value="assignments" className="mt-4"><AssignmentsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

// ── Domains ─────────────────────────────────────────────────────────────
const EMPTY_DOMAIN = {
  domain: "",
  display_name: "",
  target_origin: "https://webid-gateway.de",
  logo_url: "",
  topbar_text: "SIMULATIONSUMGEBUNG – Keine echte Identifikation. Zu Schulungszwecken.",
  allow_submit: false,
  mode: "simulation" as SimMode,
  notes: "",
};

function DomainsTab() {
  const { toast } = useToast();
  const [rows, setRows] = useState<SimDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_DOMAIN);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const d = await supabase.from("webid_sim_domains" as never).select("*").order("created_at", { ascending: false });
    if (d.error) toast({ title: "Fehler", description: d.error.message, variant: "destructive" });
    setRows(((d.data as unknown) as SimDomain[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const create = async () => {
    if (!form.domain.trim() || !form.display_name.trim()) {
      toast({ title: "Bitte Domain und Anzeigename ausfüllen", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      domain: form.domain.trim().toLowerCase(),
      display_name: form.display_name.trim(),
      target_origin: form.target_origin.trim() || "https://webid-gateway.de",
      logo_url: form.logo_url.trim() || null,
      topbar_text: form.topbar_text.trim(),
      allow_submit: form.allow_submit,
      mode: form.mode,
      notes: form.notes.trim() || null,
    };
    const { error } = await supabase.from("webid_sim_domains" as never).insert(payload as never);
    setSaving(false);
    if (error) return toast({ title: "Fehler", description: error.message, variant: "destructive" });
    toast({ title: "Domain angelegt" });
    setForm(EMPTY_DOMAIN);
    void load();
  };

  const update = async (id: string, patch: Partial<SimDomain>) => {
    const { error } = await supabase.from("webid_sim_domains" as never).update(patch as never).eq("id", id);
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    else void load();
  };

  const remove = async (id: string, domain: string) => {
    if (!confirm(`Domain ${domain} wirklich löschen?`)) return;
    const { error } = await supabase.from("webid_sim_domains" as never).delete().eq("id", id);
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    else void load();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4" /> Neue Sim-Domain</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Domain (ohne https)</Label>
            <Input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="webid.kunde.de" />
          </div>
          <div>
            <Label>Anzeigename</Label>
            <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Kunde – Schulung" />
          </div>
          <div>
            <Label>Ziel-Origin</Label>
            <Input value={form.target_origin} onChange={(e) => setForm({ ...form, target_origin: e.target.value })} />
          </div>
          <div>
            <Label>Modus</Label>
            <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-2 text-sm"
              value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as SimMode })}>
              <option value="simulation">Simulation (Overlay, Submits blockiert)</option>
              <option value="tunnel">Tunnel (echter Durchgang, Overlay oben)</option>
            </select>
          </div>
          <div>
            <Label>Logo-URL (unten rechts, optional)</Label>
            <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Topbar-Text</Label>
            <Input value={form.topbar_text} onChange={(e) => setForm({ ...form, topbar_text: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Notizen</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <Switch checked={form.allow_submit} onCheckedChange={(v) => setForm({ ...form, allow_submit: v })} />
            <span className="text-sm">POST/Submit an Original weiterreichen</span>
          </div>
          <div className="md:col-span-2">
            <Button onClick={create} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Anlegen
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Registrierte Domains</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Lade…</div>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Domain angelegt.</p>
          ) : rows.map((r) => {
            return (
              <div key={r.id} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm font-semibold">{r.domain}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.display_name} · Ziel: {r.target_origin}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.mode === "tunnel" ? "default" : "secondary"}>
                      {r.mode === "tunnel" ? "Tunnel" : "Simulation"}
                    </Badge>
                    {r.is_active ? <Badge variant="secondary">Aktiv</Badge> : <Badge variant="outline">Inaktiv</Badge>}
                    {r.allow_submit && <Badge className="bg-yellow-500/15 text-yellow-700">Submit erlaubt</Badge>}
                    <Button size="icon" variant="ghost" asChild>
                      <a href={`https://${r.domain}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(r.id, r.domain)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center gap-2">
                    <Switch checked={r.is_active} onCheckedChange={(v) => update(r.id, { is_active: v })} /><span>Aktiv</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Switch checked={r.allow_submit} onCheckedChange={(v) => update(r.id, { allow_submit: v })} /><span>Submit an Original</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <span>Modus:</span>
                    <select className="h-7 rounded-md border border-input bg-background px-2 text-xs"
                      value={r.mode} onChange={(e) => update(r.id, { mode: e.target.value as SimMode })}>
                      <option value="simulation">Simulation</option>
                      <option value="tunnel">Tunnel</option>
                    </select>
                  </label>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Vorgänge ────────────────────────────────────────────────────────────
const EMPTY_PROC = {
  key: "",
  label: "",
  provider: "webid" as "webid" | "postident",
  title: "",
  body: "",
  meta: "",
  allow_submit: false,
  is_active: true,
};

function ProceduresTab() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_PROC);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("webid_procedures" as never).select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    setRows(((data as unknown) as Procedure[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const create = async () => {
    if (!form.key.trim() || !form.label.trim() || !form.title.trim() || !form.body.trim()) {
      toast({ title: "Bitte Schlüssel, Label, Titel und Text ausfüllen", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      key: form.key.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      label: form.label.trim(),
      provider: form.provider,
      title: form.title.trim(),
      body: form.body.trim(),
      meta: form.meta.trim() || null,
      allow_submit: form.allow_submit,
      is_active: form.is_active,
    };
    const { error } = await supabase.from("webid_procedures" as never).insert(payload as never);
    setSaving(false);
    if (error) return toast({ title: "Fehler", description: error.message, variant: "destructive" });
    toast({ title: "Vorgang angelegt" });
    setForm(EMPTY_PROC);
    void load();
  };

  const update = async (id: string, patch: Partial<Procedure>) => {
    const { error } = await supabase.from("webid_procedures" as never).update(patch as never).eq("id", id);
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    else void load();
  };

  const remove = async (id: string, label: string) => {
    if (!confirm(`Vorgang „${label}" wirklich löschen?`)) return;
    const { error } = await supabase.from("webid_procedures" as never).delete().eq("id", id);
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    else void load();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4" /> Neuer Vorgang</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Schlüssel (Query-Param, klein)</Label>
            <Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="ing-basic" />
          </div>
          <div>
            <Label>Label (intern)</Label>
            <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="ING – Basiskonto" />
          </div>
          <div>
            <Label>Anbieter</Label>
            <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-2 text-sm"
              value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value as never })}>
              <option value="webid">WebID</option>
              <option value="postident">POSTIDENT</option>
            </select>
          </div>
          <div>
            <Label>Meta-Zeile (optional)</Label>
            <Input value={form.meta} onChange={(e) => setForm({ ...form, meta: e.target.value })} placeholder="Vorgangsnr. wird automatisch gesetzt" />
          </div>
          <div className="md:col-span-2">
            <Label>Titel (dem Mitarbeiter angezeigt)</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Text</Label>
            <Textarea rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 md:col-span-2 text-sm">
            <Switch checked={form.allow_submit} onCheckedChange={(v) => setForm({ ...form, allow_submit: v })} />
            <span>Submit an Original erlauben</span>
          </label>
          <div className="md:col-span-2">
            <Button onClick={create} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Anlegen
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Vorgänge</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Lade…</div>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch kein Vorgang angelegt.</p>
          ) : rows.map((p) => (
            <div key={p.id} className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{p.label} <span className="font-mono text-xs text-muted-foreground">?v={p.key}</span></p>
                  <p className="text-xs text-muted-foreground">{p.provider.toUpperCase()} · {p.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {p.is_active ? <Badge variant="secondary">Aktiv</Badge> : <Badge variant="outline">Inaktiv</Badge>}
                  <Button size="icon" variant="ghost" onClick={() => remove(p.id, p.label)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <p className="text-xs whitespace-pre-line text-muted-foreground">{p.body}</p>
              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-2">
                  <Switch checked={p.is_active} onCheckedChange={(v) => update(p.id, { is_active: v })} /><span>Aktiv</span>
                </label>
                <label className="flex items-center gap-2">
                  <Switch checked={p.allow_submit} onCheckedChange={(v) => update(p.id, { allow_submit: v })} /><span>Submit erlaubt</span>
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Zuweisungen ─────────────────────────────────────────────────────────
function AssignmentsTab() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Assignment[]>([]);
  const [procs, setProcs] = useState<Procedure[]>([]);
  const [domains, setDomains] = useState<SimDomain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const [p, d] = await Promise.all([
        supabase.from("webid_procedures" as never).select("*").eq("is_active", true).order("label"),
        supabase.from("webid_sim_domains" as never).select("*").eq("is_active", true).order("domain"),
      ]);
      setProcs(((p.data as unknown) as Procedure[]) ?? []);
      const doms = ((d.data as unknown) as SimDomain[]) ?? [];
      setDomains(doms);
      if (doms[0]) setSelectedDomainId(doms[0].id);
    })();
  }, []);

  const search = async () => {
    setLoading(true);
    let q = supabase.from("task_assignments" as never)
      .select("id,individual_case_number,webid_client_name,webid_procedure_key,user_id")
      .order("created_at", { ascending: false })
      .limit(50);
    if (query.trim()) {
      q = q.or(`individual_case_number.ilike.%${query.trim()}%,webid_client_name.ilike.%${query.trim()}%`);
    }
    const { data, error } = await q;
    setLoading(false);
    if (error) return toast({ title: "Fehler", description: error.message, variant: "destructive" });
    setRows(((data as unknown) as Assignment[]) ?? []);
  };
  useEffect(() => { void search(); }, []);

  const assign = async (id: string, key: string | null) => {
    const { error } = await supabase.from("task_assignments" as never)
      .update({ webid_procedure_key: key } as never).eq("id", id);
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    else void search();
  };

  const buildLink = (caseNumber: string | null, procKey: string | null): string => {
    const dom = domains.find((d) => d.id === selectedDomainId);
    if (!dom || !caseNumber) return "";
    const u = new URL("/", `https://${dom.domain}`);
    if (procKey) u.searchParams.set("v", procKey);
    u.searchParams.set("cn", caseNumber);
    return u.toString();
  };

  const copy = (val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    toast({ title: "Kopiert" });
  };

  const whatsapp = (val: string) => {
    if (!val) return;
    const text = encodeURIComponent(`Dein WebID-Link:\n${val}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Vorgang → Auftrag zuweisen</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px_auto]">
            <div>
              <Label>Suche (Vorgangsnr. / Klientenname)</Label>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="z. B. 620631658 oder Mustermann" />
            </div>
            <div>
              <Label>Sim-Domain für Link</Label>
              <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-2 text-sm"
                value={selectedDomainId} onChange={(e) => setSelectedDomainId(e.target.value)}>
                {domains.map((d) => (<option key={d.id} value={d.id}>{d.domain} ({d.mode})</option>))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={search} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Suchen
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine Treffer.</p>
            ) : rows.map((a) => {
              const link = buildLink(a.individual_case_number, a.webid_procedure_key);
              return (
                <div key={a.id} className="rounded-lg border border-border p-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{a.webid_client_name ?? "—"}</p>
                      <p className="text-xs font-mono text-muted-foreground">Vorgangsnr: {a.individual_case_number ?? "—"}</p>
                    </div>
                    <select className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                      value={a.webid_procedure_key ?? ""} onChange={(e) => assign(a.id, e.target.value || null)}>
                      <option value="">— kein Vorgang —</option>
                      {procs.map((p) => (<option key={p.id} value={p.key}>{p.label}</option>))}
                    </select>
                  </div>
                  {link && (
                    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 p-2">
                      <code className="flex-1 truncate text-xs">{link}</code>
                      <Button size="sm" variant="ghost" onClick={() => copy(link)}><Copy className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => whatsapp(link)}><Send className="h-3.5 w-3.5" /></Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
