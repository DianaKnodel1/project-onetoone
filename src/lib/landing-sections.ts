/**
 * Landing-Baukasten: Abschnitts-Katalog + HTML-Renderer.
 * --------------------------------------------------------------------------
 * Single Source of Truth für Baukasten-Landings (sections JSON in
 * public.landing_pages.sections). Wird verwendet von:
 *   - Portal: Live-Vorschau im Admin (/admin/landing-baukasten)
 *   - Live-Renderer (landing-server/server.js) über den generierten Mirror
 *     landing-server/sections-renderer.js
 *
 * Nach jeder Änderung an dieser Datei:
 *   bun scripts/build-sections-renderer-js.mjs
 */

import sharedFormHtml from "../landing-themes/_shared/form-section.html?raw";
import sharedFormCss from "../landing-themes/_shared/form-section.css?raw";
import sharedFormJs from "../landing-themes/_shared/form-section.js?raw";

// ── Typen ────────────────────────────────────────────────────────────────
export type SectionFieldKind = "text" | "textarea" | "image" | "color" | "boolean" | "strings" | "objects";

export type SectionField = {
  key: string;
  label: string;
  kind: SectionFieldKind;
  placeholder?: string;
  help?: string;
  /** nur kind="objects": Felder eines Listeneintrags */
  itemFields?: { key: string; label: string; kind: "text" | "textarea" | "image" }[];
  itemLabel?: string;
};

export type SectionTypeDef = {
  type: string;
  label: string;
  description: string;
  /** max. Vorkommen pro Seite (form genau 1x) */
  unique?: boolean;
  fields: SectionField[];
  defaults: () => Record<string, any>;
};

export type LandingSection = { id: string; type: string; data: Record<string, any> };

// ── Katalog ──────────────────────────────────────────────────────────────
export const SECTION_CATALOG: SectionTypeDef[] = [
  {
    type: "hero",
    label: "Titelbereich",
    description: "Großer Einstieg mit Überschrift und Bewerbungs-Knopf.",
    fields: [
      { key: "kicker", label: "Kleine Zeile über dem Titel", kind: "text", placeholder: "z.B. Personalservice · Logistik" },
      { key: "title", label: "Überschrift", kind: "text" },
      { key: "subtitle", label: "Untertitel", kind: "textarea" },
      { key: "ctaText", label: "Knopf-Text", kind: "text", placeholder: "Jetzt bewerben" },
      { key: "imageUrl", label: "Bild (URL, optional)", kind: "image", help: "Bild hochladen unter Admin → Uploads, dann URL hier einfügen." },
    ],
    defaults: () => ({
      kicker: "",
      title: "Dein neuer Job wartet — bewirb dich in 2 Minuten",
      subtitle: "Wir bringen dich in einen sicheren Job bei geprüften Unternehmen in deiner Region. Ohne lange Bewerbungsunterlagen.",
      ctaText: "Jetzt bewerben",
      imageUrl: "",
    }),
  },
  {
    type: "stelle",
    label: "Stellenanzeige",
    description: "Konkrete Stelle mit Aufgaben und Anforderungen.",
    fields: [
      { key: "title", label: "Stellentitel", kind: "text" },
      { key: "location", label: "Ort", kind: "text" },
      { key: "salary", label: "Gehalt (optional)", kind: "text", placeholder: "z.B. 14–16 €/Std." },
      { key: "intro", label: "Kurzbeschreibung", kind: "textarea" },
      { key: "tasks", label: "Aufgaben", kind: "strings", itemLabel: "Aufgabe" },
      { key: "requirements", label: "Das bringst du mit", kind: "strings", itemLabel: "Anforderung" },
    ],
    defaults: () => ({
      title: "",
      location: "",
      salary: "",
      intro: "",
      tasks: [""],
      requirements: [""],
    }),
  },
  {
    type: "ablauf",
    label: "Ablauf (So geht's)",
    description: "Nummerierte Schritte vom Bewerben bis zum Start.",
    fields: [
      { key: "title", label: "Überschrift", kind: "text" },
      {
        key: "steps", label: "Schritte", kind: "objects", itemLabel: "Schritt",
        itemFields: [
          { key: "title", label: "Titel", kind: "text" },
          { key: "desc", label: "Beschreibung", kind: "textarea" },
        ],
      },
    ],
    defaults: () => ({
      title: "In drei Schritten zur Zusage",
      steps: [
        { title: "Bewerbung abschicken", desc: "Kurzes Formular — dauert ca. 2 Minuten." },
        { title: "Termin wählen", desc: "Direkt danach wählst du deinen Wunschtermin fürs Kennenlerngespräch." },
        { title: "Kennenlernen & Start", desc: "Kurzes Gespräch, ca. 15 Minuten, bequem vom Handy. Danach geht alles Weitere sehr schnell." },
      ],
    }),
  },
  {
    type: "faq",
    label: "FAQ",
    description: "Häufige Fragen als aufklappbare Liste.",
    fields: [
      { key: "title", label: "Überschrift", kind: "text" },
      {
        key: "items", label: "Fragen", kind: "objects", itemLabel: "Frage",
        itemFields: [
          { key: "q", label: "Frage", kind: "text" },
          { key: "a", label: "Antwort", kind: "textarea" },
        ],
      },
    ],
    defaults: () => ({ title: "Häufige Fragen", items: [{ q: "", a: "" }] }),
  },
  {
    type: "logos",
    label: "Partner-Logos",
    description: "Logoleiste von Unternehmen, für die vermittelt wird.",
    fields: [
      { key: "title", label: "Überschrift", kind: "text", placeholder: "z.B. Unsere Partnerunternehmen" },
      {
        key: "items", label: "Logos", kind: "objects", itemLabel: "Logo",
        itemFields: [
          { key: "img", label: "Bild-URL", kind: "image" },
          { key: "label", label: "Name", kind: "text" },
        ],
      },
    ],
    defaults: () => ({ title: "Unsere Partnerunternehmen", items: [] }),
  },
  {
    type: "kontakt",
    label: "Ansprechpartner & Kontakt",
    description: "Persönlicher Kontakt — WhatsApp, Telefon, E-Mail aus den Grundeinstellungen.",
    fields: [
      { key: "title", label: "Überschrift", kind: "text" },
      { key: "text", label: "Text", kind: "textarea" },
      { key: "name", label: "Name der Person (optional)", kind: "text" },
      { key: "role", label: "Rolle (optional)", kind: "text", placeholder: "z.B. Deine Ansprechpartnerin" },
      { key: "showWhatsapp", label: "WhatsApp-Knopf anzeigen", kind: "boolean" },
      { key: "showPhone", label: "Telefonnummer anzeigen", kind: "boolean" },
      { key: "showEmail", label: "E-Mail anzeigen", kind: "boolean" },
    ],
    defaults: () => ({
      title: "Fragen? Schreib uns einfach.",
      text: "Du erreichst uns persönlich — wir melden uns schnell bei dir zurück.",
      name: "",
      role: "",
      showWhatsapp: true,
      showPhone: true,
      showEmail: true,
    }),
  },
  {
    type: "freitext",
    label: "Freitext",
    description: "Freier Textabschnitt (Absätze durch Leerzeilen trennen).",
    fields: [
      { key: "title", label: "Überschrift (optional)", kind: "text" },
      { key: "text", label: "Text", kind: "textarea" },
    ],
    defaults: () => ({ title: "", text: "" }),
  },
  {
    type: "bild",
    label: "Bild",
    description: "Ein einzelnes Bild in voller Breite.",
    fields: [
      { key: "imageUrl", label: "Bild-URL", kind: "image" },
      { key: "alt", label: "Beschreibung (alt)", kind: "text" },
      { key: "caption", label: "Bildunterschrift (optional)", kind: "text" },
    ],
    defaults: () => ({ imageUrl: "", alt: "", caption: "" }),
  },
  {
    type: "form",
    label: "Bewerbungsformular & Termin",
    description: "Fest verdrahtetes Bewerbungsformular mit anschließender Terminwahl. Genau einmal pro Seite.",
    unique: true,
    fields: [],
    defaults: () => ({}),
  },
];

export const SECTION_TYPES = SECTION_CATALOG.map((s) => s.type);

export function createSection(type: string): LandingSection {
  const def = SECTION_CATALOG.find((s) => s.type === type);
  if (!def) throw new Error(`Unbekannter Abschnittstyp: ${type}`);
  return {
    id: `sec_${Math.random().toString(36).slice(2, 10)}`,
    type,
    data: def.defaults(),
  };
}

/** Sinnvoller Startaufbau für eine neue Baukasten-Seite. */
export function defaultSections(): LandingSection[] {
  return ["hero", "stelle", "ablauf", "kontakt", "faq", "form"].map(createSection);
}

/** Startpunkte für „Neue Seite". */
export type SectionTemplate = { id: string; label: string; description: string; types: string[] };

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: "klassisch",
    label: "Klassische Bewerberseite",
    description: "Titelbereich, Stelle, Ablauf, Ansprechpartner, FAQ, Formular.",
    types: ["hero", "stelle", "ablauf", "kontakt", "faq", "form"],
  },
  {
    id: "kurz",
    label: "Kurze Seite",
    description: "Nur Titelbereich und Bewerbungsformular — maximal schnell.",
    types: ["hero", "form"],
  },
  {
    id: "vertrauen",
    label: "Seite mit Vertrauens-Teil",
    description: "Titelbereich, Stelle, Partner-Logos, Ansprechpartner, FAQ, Formular.",
    types: ["hero", "stelle", "logos", "kontakt", "faq", "form"],
  },
  {
    id: "leer",
    label: "Leere Seite",
    description: "Nur das Bewerbungsformular — alles andere baust du selbst.",
    types: ["form"],
  },
];

export function sectionsFromTemplate(templateId: string): LandingSection[] {
  const tpl = SECTION_TEMPLATES.find((t) => t.id === templateId) || SECTION_TEMPLATES[0];
  return tpl.types.map(createSection);
}


// ── Renderer ─────────────────────────────────────────────────────────────
function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function safeUrl(u: unknown): string {
  const s = String(u ?? "").trim();
  if (/^https:\/\//i.test(s) || s.startsWith("/assets/")) return s;
  return "";
}

function primaryOf(branding: Record<string, any>): string {
  const p = String(branding?.primary_color || "");
  return /^#[0-9a-fA-F]{6}$/.test(p) ? p : "#1d4ed8";
}

function secondaryOf(branding: Record<string, any>): string {
  const p = String(branding?.secondary_color || "");
  return /^#[0-9a-fA-F]{6}$/.test(p) ? p : "#0f172a";
}

/** {{platzhalter}} in Formular-HTML/CSS ersetzen (wie beim Theme-Renderer). */
function applyPlaceholders(src: string, branding: Record<string, any>): string {
  const b = branding || {};
  const map: Record<string, string> = {
    ...Object.fromEntries(Object.entries(b).map(([k, v]) => [k, String(v ?? "")])),
    email: String(b.email || b.contact_email || ""),
    telefon: String(b.telefon || b.contact_phone || ""),
    firmenname: String(b.firmenname || ""),
    primary_color: primaryOf(b),
    secondary_color: secondaryOf(b),
  };
  let out = src;
  for (const [k, v] of Object.entries(map)) out = out.split(`{{${k}}}`).join(v);
  return out;
}

function lines(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x ?? "").trim()).filter(Boolean);
  return String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
}

function objects(v: unknown): Record<string, any>[] {
  return Array.isArray(v) ? v.filter((x) => x && typeof x === "object") : [];
}

// ── Abschnitts-Renderer ──────────────────────────────────────────────────
function renderHero(d: Record<string, any>): string {
  const img = safeUrl(d.imageUrl);
  const cta = esc(d.ctaText || "Jetzt bewerben");
  return `<section class="lb-hero">
  <div class="lb-wrap lb-hero-grid">
    <div>
      ${d.kicker ? `<span class="lb-kicker">${esc(d.kicker)}</span>` : ""}
      <h1 class="lb-hero-title">${esc(d.title)}</h1>
      ${d.subtitle ? `<p class="lb-hero-sub">${esc(d.subtitle)}</p>` : ""}
      <p class="lb-hero-cta">
        <a class="lb-btn" href="#bewerbung-form">${cta}</a>
        <span class="lb-duration">Bewerbung dauert ca. 2&nbsp;Minuten</span>
      </p>
    </div>
    ${img ? `<div class="lb-hero-imgwrap"><img class="lb-hero-img" src="${esc(img)}" alt="" loading="eager"></div>` : ""}
  </div>
</section>`;
}

function renderStelle(d: Record<string, any>): string {
  const meta = [d.location, d.salary].filter(Boolean).map((x) => `<span class="lb-chip">${esc(x)}</span>`).join("");
  const tasks = lines(d.tasks).map((t) => `<li>${esc(t)}</li>`).join("");
  const reqs = lines(d.requirements).map((t) => `<li>${esc(t)}</li>`).join("");
  return `<section class="lb-section">
  <div class="lb-wrap">
    ${d.title ? `<h2 class="lb-h2">${esc(d.title)}</h2>` : ""}
    ${meta ? `<p class="lb-chips">${meta}</p>` : ""}
    ${d.intro ? `<p class="lb-lead">${esc(d.intro)}</p>` : ""}
    <div class="lb-cols">
      ${tasks ? `<div class="lb-card"><h3 class="lb-h3">Deine Aufgaben</h3><ul class="lb-list">${tasks}</ul></div>` : ""}
      ${reqs ? `<div class="lb-card"><h3 class="lb-h3">Das bringst du mit</h3><ul class="lb-list">${reqs}</ul></div>` : ""}
    </div>
    <p><a class="lb-btn" href="#bewerbung-form">Jetzt bewerben</a></p>
  </div>
</section>`;
}

function renderAblauf(d: Record<string, any>): string {
  const steps = objects(d.steps)
    .map((s, i) => `<li class="lb-step"><span class="lb-step-num">${i + 1}</span><div><h3 class="lb-h3">${esc(s.title)}</h3>${s.desc ? `<p class="lb-p">${esc(s.desc)}</p>` : ""}</div></li>`)
    .join("");
  return `<section class="lb-section lb-alt">
  <div class="lb-wrap lb-narrow">
    ${d.title ? `<h2 class="lb-h2">${esc(d.title)}</h2>` : ""}
    <ol class="lb-steps">${steps}</ol>
  </div>
</section>`;
}

function renderFaq(d: Record<string, any>): string {
  const items = objects(d.items)
    .filter((it) => it.q)
    .map((it) => `<details class="lb-faq-item"><summary>${esc(it.q)}</summary><p class="lb-p">${esc(it.a)}</p></details>`)
    .join("");
  return `<section class="lb-section">
  <div class="lb-wrap lb-narrow">
    ${d.title ? `<h2 class="lb-h2">${esc(d.title)}</h2>` : ""}
    ${items}
  </div>
</section>`;
}

function renderLogos(d: Record<string, any>): string {
  const items = objects(d.items)
    .map((it) => {
      const img = safeUrl(it.img);
      if (!img) return "";
      return `<figure class="lb-logo"><img src="${esc(img)}" alt="${esc(it.label || "")}" loading="lazy"><figcaption>${esc(it.label || "")}</figcaption></figure>`;
    })
    .filter(Boolean)
    .join("");
  if (!items) return "";
  return `<section class="lb-section lb-alt">
  <div class="lb-wrap">
    ${d.title ? `<h2 class="lb-h2 lb-center">${esc(d.title)}</h2>` : ""}
    <div class="lb-logos">${items}</div>
  </div>
</section>`;
}

function renderKontakt(d: Record<string, any>, branding: Record<string, any>): string {
  const wa = branding?.whatsapp_enabled ? String(branding?.whatsapp_number || "").replace(/[^0-9]/g, "") : "";
  const phone = String(branding?.telefon || "").trim();
  const email = String(branding?.email || "").trim();
  const btns: string[] = [];
  if (d.showWhatsapp && wa) btns.push(`<a class="lb-btn" href="https://wa.me/${esc(wa)}" target="_blank" rel="noopener">Per WhatsApp schreiben</a>`);
  if (d.showPhone && phone) btns.push(`<a class="lb-btn lb-btn-ghost" href="tel:${esc(phone.replace(/\s+/g, ""))}">${esc(phone)}</a>`);
  if (d.showEmail && email) btns.push(`<a class="lb-btn lb-btn-ghost" href="mailto:${esc(email)}">${esc(email)}</a>`);
  const person = d.name ? `<p class="lb-person"><strong>${esc(d.name)}</strong>${d.role ? `<br><span>${esc(d.role)}</span>` : ""}</p>` : "";
  return `<section class="lb-section">
  <div class="lb-wrap lb-narrow lb-center">
    ${d.title ? `<h2 class="lb-h2">${esc(d.title)}</h2>` : ""}
    ${person}
    ${d.text ? `<p class="lb-lead">${esc(d.text)}</p>` : ""}
    ${btns.length ? `<p class="lb-btnrow">${btns.join("")}</p>` : ""}
  </div>
</section>`;
}

function renderFreitext(d: Record<string, any>): string {
  const paras = String(d.text || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p class="lb-p">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<section class="lb-section">
  <div class="lb-wrap lb-narrow">
    ${d.title ? `<h2 class="lb-h2">${esc(d.title)}</h2>` : ""}
    ${paras}
  </div>
</section>`;
}

function renderBild(d: Record<string, any>): string {
  const img = safeUrl(d.imageUrl);
  if (!img) return "";
  return `<section class="lb-section">
  <div class="lb-wrap">
    <figure class="lb-bild"><img src="${esc(img)}" alt="${esc(d.alt || "")}" loading="lazy">${d.caption ? `<figcaption>${esc(d.caption)}</figcaption>` : ""}</figure>
  </div>
</section>`;
}

function renderForm(branding: Record<string, any>): string {
  return applyPlaceholders(sharedFormHtml, branding);
}

// ── Basis-CSS ────────────────────────────────────────────────────────────
const BASE_CSS = `
:root{--lb-primary:#1d4ed8;--lb-secondary:#0f172a;--lb-ink:#0f172a;--lb-muted:#475569;--lb-line:#e2e8f0;--lb-bg:#ffffff;}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:var(--lb-bg);color:var(--lb-ink);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased;}
img{max-width:100%;height:auto;display:block}
a{color:var(--lb-primary)}
.lb-wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.lb-narrow{max-width:760px}
.lb-center{text-align:center}
.lb-header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--lb-line);}
.lb-header-in{max-width:1080px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.lb-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;color:var(--lb-ink);text-decoration:none}
.lb-brand img{max-height:36px;width:auto}
.lb-header .lb-btn{padding:10px 20px;font-size:14px}
.lb-btn{display:inline-block;background:var(--lb-primary);color:#fff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:999px;font-size:16px;transition:transform .15s,box-shadow .15s}
.lb-btn:hover{transform:translateY(-1px);box-shadow:0 10px 26px -10px var(--lb-primary);text-decoration:none}
.lb-btn-ghost{background:transparent;color:var(--lb-primary);border:2px solid var(--lb-primary)}
.lb-btnrow{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:18px}
.lb-duration{display:block;margin-top:10px;font-size:13px;color:var(--lb-muted)}
.lb-hero{padding:88px 0;background:linear-gradient(180deg,color-mix(in oklab,var(--lb-primary) 7%,#fff) 0%,#fff 100%)}
.lb-hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}
@media(max-width:860px){.lb-hero-grid{grid-template-columns:1fr;gap:28px}.lb-hero{padding:56px 0}}
.lb-kicker{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lb-primary);background:color-mix(in oklab,var(--lb-primary) 10%,transparent);padding:6px 12px;border-radius:999px;margin-bottom:16px}
.lb-hero-title{font-size:clamp(30px,4.6vw,50px);line-height:1.12;font-weight:800;letter-spacing:-.015em;margin:0 0 18px}
.lb-hero-sub{font-size:18px;color:var(--lb-muted);margin:0 0 26px;max-width:56ch}
.lb-hero-cta{margin:0}
.lb-hero-img{border-radius:18px;box-shadow:0 24px 60px -20px rgba(15,23,42,.25)}
.lb-section{padding:72px 0}
.lb-alt{background:#f8fafc}
.lb-h2{font-size:clamp(24px,3vw,34px);font-weight:800;letter-spacing:-.01em;margin:0 0 18px}
.lb-h3{font-size:17px;font-weight:700;margin:0 0 8px}
.lb-lead{font-size:17px;color:var(--lb-muted);margin:0 0 22px}
.lb-p{color:var(--lb-muted);margin:0 0 14px}
.lb-chips{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 18px;padding:0}
.lb-chip{display:inline-block;background:color-mix(in oklab,var(--lb-primary) 9%,#fff);color:var(--lb-ink);border:1px solid color-mix(in oklab,var(--lb-primary) 25%,var(--lb-line));font-size:14px;font-weight:600;padding:6px 14px;border-radius:999px}
.lb-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:0 0 26px}
@media(max-width:760px){.lb-cols{grid-template-columns:1fr}}
.lb-card{background:#fff;border:1px solid var(--lb-line);border-radius:14px;padding:22px 24px}
.lb-list{margin:0;padding-left:20px;color:var(--lb-muted)}
.lb-list li{margin-bottom:8px}
.lb-steps{list-style:none;margin:0;padding:0;display:grid;gap:18px}
.lb-step{display:flex;gap:18px;align-items:flex-start;background:#fff;border:1px solid var(--lb-line);border-radius:14px;padding:20px 22px}
.lb-step-num{flex:0 0 auto;width:38px;height:38px;border-radius:50%;background:var(--lb-primary);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:17px}
.lb-faq-item{background:#fff;border:1px solid var(--lb-line);border-radius:12px;padding:16px 20px;margin-bottom:12px}
.lb-faq-item summary{font-weight:700;cursor:pointer;list-style:none}
.lb-faq-item summary::-webkit-details-marker{display:none}
.lb-faq-item summary::after{content:"+";float:right;color:var(--lb-primary);font-weight:800}
.lb-faq-item[open] summary::after{content:"–"}
.lb-faq-item p{margin-top:10px}
.lb-logos{display:flex;flex-wrap:wrap;gap:28px;align-items:center;justify-content:center;margin-top:8px}
.lb-logo{margin:0;text-align:center}
.lb-logo img{max-height:52px;width:auto;filter:grayscale(15%)}
.lb-logo figcaption{font-size:12px;color:var(--lb-muted);margin-top:6px}
.lb-person{margin:0 0 10px;font-size:16px}
.lb-person span{color:var(--lb-muted);font-size:14px}
.lb-bild{margin:0}
.lb-bild img{border-radius:16px;width:100%}
.lb-bild figcaption{text-align:center;font-size:13px;color:var(--lb-muted);margin-top:10px}
.lb-footer{background:var(--lb-secondary);color:#cbd5e1;padding:44px 20px;font-size:14px}
.lb-footer-in{max-width:1080px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px 28px;align-items:center;justify-content:space-between}
.lb-footer a{color:#e2e8f0;text-decoration:none}
.lb-footer a:hover{text-decoration:underline}
`;

// ── Editor-Overlay (nur Vorschau im Admin, nie auf der Live-Seite) ───────
const EDITOR_CSS = `
[data-lb-sec]{position:relative}
[data-lb-sec]:hover{outline:2px dashed rgba(37,99,235,.55);outline-offset:-2px}
[data-lb-sec].lb-ed-active{outline:2px solid #2563eb;outline-offset:-2px}
.lb-ed-bar{position:absolute;top:8px;right:8px;z-index:9999;display:none;gap:6px;background:#0f172a;border-radius:999px;padding:5px 8px;box-shadow:0 8px 24px -8px rgba(0,0,0,.5)}
[data-lb-sec]:hover>.lb-ed-bar,[data-lb-sec].lb-ed-active>.lb-ed-bar{display:flex}
.lb-ed-bar button{all:unset;cursor:pointer;color:#fff;font:600 12px/1 system-ui,sans-serif;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.12)}
.lb-ed-bar button:hover{background:#2563eb}
.lb-ed-bar .lb-ed-del:hover{background:#dc2626}
.lb-ed-label{position:absolute;top:8px;left:8px;z-index:9998;display:none;background:#2563eb;color:#fff;font:600 11px/1 system-ui,sans-serif;padding:5px 9px;border-radius:999px}
[data-lb-sec]:hover>.lb-ed-label,[data-lb-sec].lb-ed-active>.lb-ed-label{display:block}
.lb-ed-add{position:relative;height:0;z-index:9997}
.lb-ed-add button{all:unset;cursor:pointer;position:absolute;left:50%;top:-14px;transform:translateX(-50%);width:28px;height:28px;border-radius:50%;background:#2563eb;color:#fff;font:700 17px/26px system-ui,sans-serif;text-align:center;opacity:0;transition:opacity .15s;box-shadow:0 6px 18px -6px rgba(37,99,235,.9)}
.lb-ed-add:hover button,.lb-ed-add button:focus{opacity:1}
body.lb-ed-body a{pointer-events:none}
`;

const EDITOR_JS = `
(function(){
  function send(msg){ parent.postMessage(Object.assign({source:"lb-editor"},msg),"*"); }
  document.body.classList.add("lb-ed-body");
  document.addEventListener("click",function(e){
    var btn=e.target.closest("[data-lb-act]");
    if(btn){
      e.preventDefault(); e.stopPropagation();
      send({action:btn.getAttribute("data-lb-act"),id:btn.getAttribute("data-lb-id"),index:Number(btn.getAttribute("data-lb-index"))});
      return;
    }
    var sec=e.target.closest("[data-lb-sec]");
    if(sec){ e.preventDefault(); send({action:"select",id:sec.getAttribute("data-lb-sec")}); }
  },true);
  window.addEventListener("message",function(ev){
    var d=ev.data||{};
    if(d.source!=="lb-parent") return;
    document.querySelectorAll("[data-lb-sec]").forEach(function(el){ el.classList.remove("lb-ed-active"); });
    if(d.action==="highlight"&&d.id){
      var el=document.querySelector('[data-lb-sec="'+d.id+'"]');
      if(el){ el.classList.add("lb-ed-active"); el.scrollIntoView({behavior:"smooth",block:"center"}); }
    }
  });
})();
`;

function editorWrap(html: string, sec: LandingSection, index: number, total: number, label: string): string {
  const id = esc(sec.id);
  const btn = (act: string, text: string, cls = "") =>
    `<button type="button" class="${cls}" data-lb-act="${act}" data-lb-id="${id}" data-lb-index="${index}">${text}</button>`;
  const bar = `<div class="lb-ed-bar">
    ${btn("edit", "Bearbeiten")}
    ${index > 0 ? btn("up", "↑") : ""}
    ${index < total - 1 ? btn("down", "↓") : ""}
    ${btn("delete", "Löschen", "lb-ed-del")}
  </div>`;
  const addBefore = `<div class="lb-ed-add">${btn("add", "+")}</div>`;
  return `${addBefore}<div data-lb-sec="${id}" data-lb-index="${index}"><div class="lb-ed-label">${esc(label)}</div>${bar}${html}</div>`;
}

// ── Seitenaufbau ─────────────────────────────────────────────────────────
export function renderSectionsLanding(opts: {
  sections: LandingSection[];
  branding?: Record<string, any>;
  host?: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  /** nur Admin-Vorschau: Abschnitte markieren + Bearbeiten-Overlay einblenden */
  editor?: boolean;
}): string {
  const branding = opts.branding || {};
  const firm = String(branding.firmenname || "");
  const primary = primaryOf(branding);
  const secondary = secondaryOf(branding);
  const host = String(opts.host || branding.landing_domain || "").replace(/^www\./, "");
  const editor = Boolean(opts.editor);

  const list = Array.isArray(opts.sections) ? opts.sections : [];
  const bodyParts: string[] = [];
  let hasForm = false;
  list.forEach((sec, i) => {
    const d = sec?.data || {};
    let html = "";
    switch (sec?.type) {
      case "hero": html = renderHero(d); break;
      case "stelle": html = renderStelle(d); break;
      case "ablauf": html = renderAblauf(d); break;
      case "faq": html = renderFaq(d); break;
      case "logos": html = renderLogos(d); break;
      case "kontakt": html = renderKontakt(d, branding); break;
      case "freitext": html = renderFreitext(d); break;
      case "bild": html = renderBild(d); break;
      case "form":
        if (!hasForm) { html = renderForm(branding); hasForm = true; }
        break;
    }
    if (!html && editor) {
      const def = SECTION_CATALOG.find((x) => x.type === sec?.type);
      html = `<section class="lb-section"><div class="lb-wrap lb-center"><p class="lb-p">„${esc(def?.label || sec?.type)}" ist noch leer — bitte Inhalte ergänzen.</p></div></section>`;
    }
    if (!html) return;
    if (editor) {
      const def = SECTION_CATALOG.find((x) => x.type === sec?.type);
      bodyParts.push(editorWrap(html, sec, i, list.length, def?.label || String(sec?.type || "")));
    } else {
      bodyParts.push(html);
    }
  });
  // Sicherheitsnetz: eine Landing ohne Formular bringt nichts — anhängen.
  if (!hasForm && !editor) bodyParts.push(renderForm(branding));
  if (editor) {
    bodyParts.push(`<div class="lb-ed-add"><button type="button" data-lb-act="add" data-lb-id="" data-lb-index="${list.length}">+</button></div>`);
  }

  const brand = opts.logoUrl
    ? `<img src="/assets/logo" alt="${esc(firm)}">`
    : `<span>${esc(firm)}</span>`;

  const addr = [branding.strasse, [branding.plz, branding.stadt].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const title = String(branding.seo_title || firm || "Jetzt bewerben");
  const desc = String(branding.seo_description || "");
  const formCss = applyPlaceholders(sharedFormCss, branding);
  const formJs = applyPlaceholders(sharedFormJs, branding).replace(/<\/script/gi, "<\\/script");

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${desc ? `<meta name="description" content="${esc(desc)}">` : ""}
<meta property="og:title" content="${esc(title)}">
${desc ? `<meta property="og:description" content="${esc(desc)}">` : ""}
<meta property="og:type" content="website">
${host ? `<meta property="og:url" content="https://${esc(host)}">` : ""}
<meta name="twitter:card" content="summary">
${opts.faviconUrl ? `<link rel="icon" href="/assets/favicon">` : ""}
<style>
${BASE_CSS.replace(/#1d4ed8/g, primary).replace(/#0f172a/g, secondary)}
${formCss}
${editor ? EDITOR_CSS : ""}
</style>
</head>
<body>
<header class="lb-header"><div class="lb-header-in">
  <a class="lb-brand" href="/">${brand}</a>
  <a class="lb-btn" href="#bewerbung-form">Jetzt bewerben</a>
</div></header>
<main>
${bodyParts.join("\n")}
</main>
<footer class="lb-footer"><div class="lb-footer-in">
  <span>© ${new Date().getFullYear()} ${esc(firm)}</span>
  ${addr ? `<span>${esc(addr)}</span>` : ""}
  <span><a href="/impressum.html">Impressum</a> &nbsp;·&nbsp; <a href="/datenschutz.html">Datenschutz</a></span>
</div></footer>
${editor ? `<script>${EDITOR_JS}</script>` : `<script>${formJs}</script>`}
</body>
</html>`;
}

