"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  creditMgc,
  creditRclc,
  parseCredits,
  slugifyProject,
  type Project,
  type ProjectCredit,
  type ProjectImage,
} from "@/lib/projects";

const inputClass =
  "w-full border border-warm-gray bg-white px-3.5 py-2.5 font-heading text-sm text-charcoal focus:border-chestnut focus:outline-none";

type Draft = {
  name: string;
  slug: string;
  category: string;
  year: string;
  status: string;
  location: string;
  role: string;
  description: string;
  story: string;
  scope: string;
  hero: string;
  heroAlt: string;
  imagesJson: string;
  piecesJson: string;
  capstoneJson: string;
  credits: ProjectCredit[];
  sort_order: string;
  is_published: boolean;
};

const emptyDraft = (): Draft => ({
  name: "",
  slug: "",
  category: "Residential",
  year: String(new Date().getFullYear()),
  status: "Design",
  location: "",
  role: "",
  description: "",
  story: "",
  scope: "",
  hero: "",
  heroAlt: "",
  imagesJson: "[]",
  piecesJson: "",
  capstoneJson: "",
  credits: [{ ...creditMgc }],
  sort_order: "50",
  is_published: true,
});

function draftFromProject(p: Project): Draft {
  return {
    name: p.name,
    slug: p.slug,
    category: p.category,
    year: p.year,
    status: p.status,
    location: p.location ?? "",
    role: p.role,
    description: p.description,
    story: p.story,
    scope: (p.scope ?? []).join(", "),
    hero: p.hero,
    heroAlt: p.heroAlt,
    imagesJson: JSON.stringify(p.images ?? [], null, 2),
    piecesJson: p.pieces ? JSON.stringify(p.pieces, null, 2) : "",
    capstoneJson: p.capstone ? JSON.stringify(p.capstone, null, 2) : "",
    credits: p.credits?.length ? p.credits.map((c) => ({ ...c })) : [],
    sort_order: String(p.sort_order ?? 50),
    is_published: p.is_published ?? true,
  };
}

function parseImages(raw: string): ProjectImage[] | null {
  try {
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return null;
    return parsed.map((item) => ({
      src: String(item.src ?? ""),
      alt: String(item.alt ?? ""),
      kind:
        item.kind === "diagram" || item.kind === "drawing"
          ? item.kind
          : "render",
    }));
  } catch {
    return null;
  }
}

function parseOptionalJson(raw: string): unknown | null | false {
  const t = raw.trim();
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return false;
  }
}

function toPayload(d: Draft):
  | { error: string; row?: undefined }
  | {
      error?: undefined;
      row: {
        name: string;
        slug: string;
        category: string;
        year: string;
        status: string;
        location: string | null;
        role: string;
        description: string;
        story: string;
        scope: string[];
        hero: string;
        hero_alt: string;
        images: ProjectImage[];
        pieces: unknown;
        capstone: unknown;
        credits: ProjectCredit[];
        sort_order: number;
        is_published: boolean;
        updated_at: string;
      };
    } {
  const images = parseImages(d.imagesJson);
  const pieces = parseOptionalJson(d.piecesJson);
  const capstone = parseOptionalJson(d.capstoneJson);
  if (images === null) return { error: "Gallery JSON is invalid." };
  if (pieces === false) return { error: "Pieces JSON is invalid." };
  if (capstone === false) return { error: "Capstone JSON is invalid." };
  for (const credit of d.credits) {
    if (!credit.logo.trim()) {
      return { error: "Each credit needs a logo image." };
    }
  }
  const sort = Number(d.sort_order);
  if (!d.name.trim() || !Number.isFinite(sort)) {
    return { error: "Name and a numeric sort order are required." };
  }
  const slug =
    (d.slug.trim() || slugifyProject(d.name) || `project-${Date.now()}`).slice(
      0,
      64,
    );
  return {
    row: {
      name: d.name.trim(),
      slug,
      category: d.category.trim(),
      year: d.year.trim(),
      status: d.status.trim(),
      location: d.location.trim() || null,
      role: d.role.trim(),
      description: d.description.trim(),
      story: d.story.trim(),
      scope: d.scope
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      hero: d.hero.trim(),
      hero_alt: d.heroAlt.trim(),
      images,
      pieces,
      capstone,
      credits: d.credits.map((c) => ({
        name: c.name.trim(),
        logo: c.logo.trim(),
        logoAlt: (c.logoAlt || c.name).trim(),
        layout: c.layout === "logo" ? "logo" : "badge",
      })),
      sort_order: sort,
      is_published: d.is_published,
      updated_at: new Date().toISOString(),
    },
  };
}

function mapDbToProject(data: Record<string, unknown>): Project {
  return {
    id: String(data.id),
    slug: String(data.slug),
    name: String(data.name),
    category: String(data.category ?? ""),
    year: String(data.year ?? ""),
    status: String(data.status ?? ""),
    location: data.location ? String(data.location) : undefined,
    role: String(data.role ?? ""),
    description: String(data.description ?? ""),
    story: String(data.story ?? ""),
    scope: Array.isArray(data.scope) ? (data.scope as string[]) : [],
    hero: String(data.hero ?? ""),
    heroAlt: String(data.hero_alt ?? ""),
    images: Array.isArray(data.images) ? (data.images as ProjectImage[]) : [],
    pieces: (data.pieces as Project["pieces"]) ?? undefined,
    capstone: (data.capstone as Project["capstone"]) ?? undefined,
    credits: parseCredits(data.credits),
    sort_order: Number(data.sort_order) || 0,
    is_published: Boolean(data.is_published),
  };
}

const SELECT =
  "id, slug, name, category, year, status, location, role, description, story, scope, hero, hero_alt, images, pieces, capstone, credits, sort_order, is_published";

export default function ProjectsCrud({ initial }: { initial: Project[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Draft | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const createFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);
  const createGalleryRef = useRef<HTMLInputElement>(null);
  const editGalleryRef = useRef<HTMLInputElement>(null);

  async function revalidate() {
    await fetch("/api/revalidate", { method: "POST" });
    router.refresh();
  }

  async function uploadFile(
    file: File,
    folder: string,
    onUrl: (url: string) => void,
  ): Promise<boolean> {
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `projects/${folder || "misc"}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("site").upload(path, file, {
      upsert: true,
    });
    if (error) {
      setStatus("error");
      setMessage("Upload failed. Try a smaller image.");
      return false;
    }
    const { data } = supabase.storage.from("site").getPublicUrl(path);
    onUrl(data.publicUrl);
    return true;
  }

  async function createRow() {
    setMessage(null);
    const payload = toPayload(draft);
    if (payload.error || !payload.row) {
      setMessage(payload.error ?? "Invalid project.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .insert(payload.row)
      .select(SELECT)
      .single();
    if (error || !data) {
      setStatus("error");
      setMessage(
        error?.message?.includes("duplicate")
          ? "A project with that slug already exists."
          : error?.message?.includes("schema cache") ||
              error?.code === "PGRST205"
            ? "Projects table missing — run supabase/migrations/0006_projects.sql in the SQL editor."
            : error?.message?.includes("credits")
              ? "Credits column missing — run supabase/migrations/0008_project_credits.sql (or _pending_credits_apply.sql)."
            : "Couldn't create the project. Try again.",
      );
      return;
    }
    setRows((prev) =>
      [...prev, mapDbToProject(data as Record<string, unknown>)].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
    );
    setDraft(emptyDraft());
    setStatus("idle");
    setMessage("Project saved — it appears on /work when published.");
    await revalidate();
  }

  function startEdit(row: Project) {
    setEditingId(row.id ?? null);
    setEdit(draftFromProject(row));
    setMessage(null);
  }

  async function saveEdit(id: string) {
    if (!edit) return;
    setMessage(null);
    const payload = toPayload(edit);
    if (payload.error || !payload.row) {
      setMessage(payload.error ?? "Invalid project.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update(payload.row)
      .eq("id", id);
    if (error) {
      setStatus("error");
      setMessage(
        error.message.includes("duplicate")
          ? "That slug is already taken."
          : "Couldn't save. Try again.",
      );
      return;
    }
    setRows((prev) =>
      prev
        .map((r) =>
          r.id === id
            ? mapDbToProject({
                id,
                ...payload.row,
              } as Record<string, unknown>)
            : r,
        )
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    );
    setEditingId(null);
    setEdit(null);
    setStatus("idle");
    setMessage("Project updated.");
    await revalidate();
  }

  async function removeRow(id: string | undefined, name: string) {
    if (!id || id.startsWith("default-")) {
      setMessage(
        "Seed projects live in code until the projects table is migrated and seeded.",
      );
      setStatus("error");
      return;
    }
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      setStatus("error");
      setMessage("Couldn't delete. Try again.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEdit(null);
    }
    setStatus("idle");
    setMessage("Project deleted.");
    await revalidate();
  }

  return (
    <div className="mt-10 space-y-10">
      {message ? (
        <p
          role="status"
          className={`font-heading text-sm ${
            status === "error" ? "text-terracotta" : "text-military"
          }`}
        >
          {message}
        </p>
      ) : null}

      <section className="border border-warm-gray/80 bg-beige/40 p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold text-charcoal">
          New project
        </h2>
        <p className="mt-1 text-sm text-charcoal/65">
          Core fields, project credits, and gallery. Optional pieces / capstone
          JSON keep Built-in and Capstone layouts working.
        </p>
        <ProjectForm
          value={draft}
          onChange={(next) => {
            if (!next.slug || next.slug === slugifyProject(draft.name)) {
              setDraft({
                ...next,
                slug: slugifyProject(next.name),
              });
            } else {
              setDraft(next);
            }
          }}
          heroFileRef={createFileRef}
          galleryFileRef={createGalleryRef}
          onHeroUpload={async (file) => {
            await uploadFile(file, draft.slug || "new", (url) =>
              setDraft((d) => ({ ...d, hero: url })),
            );
          }}
          onGalleryUpload={async (file) => {
            await uploadFile(file, draft.slug || "new", (url) => {
              setDraft((d) => {
                const images = parseImages(d.imagesJson) ?? [];
                images.push({
                  src: url,
                  alt: file.name,
                  kind: "render",
                });
                return {
                  ...d,
                  imagesJson: JSON.stringify(images, null, 2),
                  hero: d.hero || url,
                };
              });
            });
          }}
          onCreditLogoUpload={async (index, file) => {
            await uploadFile(file, `${draft.slug || "new"}/credits`, (url) => {
              setDraft((d) => {
                const credits = d.credits.map((c, i) =>
                  i === index ? { ...c, logo: url } : c,
                );
                return { ...d, credits };
              });
            });
          }}
        />
        <button
          type="button"
          onClick={createRow}
          disabled={status === "saving"}
          className="mt-5 inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-terracotta disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Create project"}
        </button>
      </section>

      <ul className="space-y-4">
        {rows.map((row) => (
          <li
            key={row.id ?? row.slug}
            className="border border-warm-gray/80 bg-white p-4 sm:p-5"
          >
            {editingId && editingId === row.id && edit ? (
              <div>
                <ProjectForm
                  value={edit}
                  onChange={setEdit}
                  heroFileRef={editFileRef}
                  galleryFileRef={editGalleryRef}
                  onHeroUpload={async (file) => {
                    await uploadFile(file, edit.slug || row.slug, (url) =>
                      setEdit((d) => (d ? { ...d, hero: url } : d)),
                    );
                  }}
                  onGalleryUpload={async (file) => {
                    await uploadFile(file, edit.slug || row.slug, (url) => {
                      setEdit((d) => {
                        if (!d) return d;
                        const images = parseImages(d.imagesJson) ?? [];
                        images.push({
                          src: url,
                          alt: file.name,
                          kind: "render",
                        });
                        return {
                          ...d,
                          imagesJson: JSON.stringify(images, null, 2),
                        };
                      });
                    });
                  }}
                  onCreditLogoUpload={async (index, file) => {
                    await uploadFile(
                      file,
                      `${edit.slug || row.slug}/credits`,
                      (url) => {
                        setEdit((d) => {
                          if (!d) return d;
                          const credits = d.credits.map((c, i) =>
                            i === index ? { ...c, logo: url } : c,
                          );
                          return { ...d, credits };
                        });
                      },
                    );
                  }}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => row.id && saveEdit(row.id)}
                    disabled={status === "saving"}
                    className="inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-4 py-2 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-terracotta disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEdit(null);
                    }}
                    className="inline-flex min-h-11 cursor-pointer items-center border border-warm-gray px-4 py-2 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {row.hero ? (
                  <div className="relative h-24 w-36 shrink-0 overflow-hidden bg-beige">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.hero}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-base font-semibold text-charcoal">
                      {row.name}
                    </h3>
                    <span
                      className={`font-heading text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${
                        row.is_published !== false
                          ? "text-military"
                          : "text-charcoal/40"
                      }`}
                    >
                      {row.is_published !== false ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 font-heading text-xs text-charcoal/50">
                    /work/{row.slug} · {row.category} · {row.year} · sort{" "}
                    {row.sort_order ?? "—"}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">
                    {row.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`/work/${row.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 cursor-pointer items-center font-heading text-xs font-semibold uppercase tracking-[0.12em] text-chestnut underline-offset-2 hover:underline"
                    >
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="inline-flex min-h-10 cursor-pointer items-center font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id, row.name)}
                      className="inline-flex min-h-10 cursor-pointer items-center font-heading text-xs font-semibold uppercase tracking-[0.12em] text-terracotta"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectForm({
  value,
  onChange,
  heroFileRef,
  galleryFileRef,
  onHeroUpload,
  onGalleryUpload,
  onCreditLogoUpload,
}: {
  value: Draft;
  onChange: (d: Draft) => void;
  heroFileRef: RefObject<HTMLInputElement | null>;
  galleryFileRef: RefObject<HTMLInputElement | null>;
  onHeroUpload: (file: File) => Promise<void>;
  onGalleryUpload: (file: File) => Promise<void>;
  onCreditLogoUpload: (index: number, file: File) => Promise<void>;
}) {
  function set<K extends keyof Draft>(key: K, v: Draft[K]) {
    onChange({ ...value, [key]: v });
  }

  function updateCredit(index: number, patch: Partial<ProjectCredit>) {
    set(
      "credits",
      value.credits.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    );
  }

  function removeCredit(index: number) {
    set(
      "credits",
      value.credits.filter((_, i) => i !== index),
    );
  }

  function addCredit(preset?: ProjectCredit) {
    set("credits", [
      ...value.credits,
      preset
        ? { ...preset }
        : {
            name: "",
            logo: "",
            logoAlt: "",
            layout: "badge" as const,
          },
    ]);
  }

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Name
        </span>
        <input
          className={inputClass}
          value={value.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Slug
        </span>
        <input
          className={inputClass}
          value={value.slug}
          onChange={(e) => set("slug", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Category
        </span>
        <input
          className={inputClass}
          value={value.category}
          onChange={(e) => set("category", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Year
        </span>
        <input
          className={inputClass}
          value={value.year}
          onChange={(e) => set("year", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Status
        </span>
        <input
          className={inputClass}
          value={value.status}
          onChange={(e) => set("status", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Location
        </span>
        <input
          className={inputClass}
          value={value.location}
          onChange={(e) => set("location", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Role
        </span>
        <input
          className={inputClass}
          value={value.role}
          onChange={(e) => set("role", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Sort order
        </span>
        <input
          className={inputClass}
          value={value.sort_order}
          onChange={(e) => set("sort_order", e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2 sm:col-span-2">
        <input
          type="checkbox"
          checked={value.is_published}
          onChange={(e) => set("is_published", e.target.checked)}
          className="h-4 w-4 accent-[#753627]"
        />
        <span className="font-heading text-sm text-charcoal">Published</span>
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Short description
        </span>
        <textarea
          className={`${inputClass} min-h-20`}
          value={value.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Story
        </span>
        <textarea
          className={`${inputClass} min-h-32`}
          value={value.story}
          onChange={(e) => set("story", e.target.value)}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Scope (comma-separated)
        </span>
        <input
          className={inputClass}
          value={value.scope}
          onChange={(e) => set("scope", e.target.value)}
        />
      </label>

      <div className="sm:col-span-2 border border-warm-gray/70 bg-beige/30 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
              Project credits
            </p>
            <p className="mt-1 text-sm text-charcoal/60">
              Logos under Scope on the public project page. Remove all to hide
              the strip.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addCredit(creditMgc)}
              className="inline-flex min-h-10 cursor-pointer items-center border border-warm-gray bg-white px-3 py-1.5 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-charcoal"
            >
              Add MGC
            </button>
            <button
              type="button"
              onClick={() => addCredit(creditRclc)}
              className="inline-flex min-h-10 cursor-pointer items-center border border-warm-gray bg-white px-3 py-1.5 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-charcoal"
            >
              Add RCLC
            </button>
            <button
              type="button"
              onClick={() => addCredit()}
              className="inline-flex min-h-10 cursor-pointer items-center border border-warm-gray bg-white px-3 py-1.5 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-charcoal"
            >
              Add custom
            </button>
          </div>
        </div>

        {value.credits.length === 0 ? (
          <p className="mt-4 border border-dashed border-warm-gray bg-white p-4 text-sm text-charcoal/55">
            No credits — the public page will hide this section.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {value.credits.map((credit, index) => (
              <li
                key={`credit-${index}`}
                className="grid gap-3 border border-warm-gray/60 bg-white p-3 sm:grid-cols-[auto_1fr_auto]"
              >
                <div className="flex h-16 w-24 items-center justify-center bg-beige/50">
                  {credit.logo ? (
                    <Image
                      src={credit.logo}
                      alt=""
                      width={96}
                      height={48}
                      className="max-h-14 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-heading text-[0.65rem] uppercase tracking-[0.12em] text-charcoal/40">
                      No logo
                    </span>
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block font-heading text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                      Name
                    </span>
                    <input
                      className={inputClass}
                      value={credit.name}
                      onChange={(e) =>
                        updateCredit(index, { name: e.target.value })
                      }
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block font-heading text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                      Logo URL
                    </span>
                    <input
                      className={inputClass}
                      value={credit.logo}
                      onChange={(e) =>
                        updateCredit(index, { logo: e.target.value })
                      }
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2 block w-full text-sm text-charcoal/70"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void onCreditLogoUpload(index, file);
                      }}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block font-heading text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                      Logo alt
                    </span>
                    <input
                      className={inputClass}
                      value={credit.logoAlt}
                      onChange={(e) =>
                        updateCredit(index, { logoAlt: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block font-heading text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                      Layout
                    </span>
                    <select
                      className={inputClass}
                      value={credit.layout}
                      onChange={(e) =>
                        updateCredit(index, {
                          layout:
                            e.target.value === "logo" ? "logo" : "badge",
                        })
                      }
                    >
                      <option value="badge">Badge (logo + name)</option>
                      <option value="logo">Logo only</option>
                    </select>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removeCredit(index)}
                  className="h-fit cursor-pointer font-heading text-xs font-semibold uppercase tracking-[0.12em] text-terracotta"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="block sm:col-span-2">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Hero image URL
        </span>
        <input
          className={inputClass}
          value={value.hero}
          onChange={(e) => set("hero", e.target.value)}
        />
        <input
          ref={heroFileRef}
          type="file"
          accept="image/*"
          className="mt-2 block w-full text-sm text-charcoal/70"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onHeroUpload(file);
          }}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Hero alt text
        </span>
        <input
          className={inputClass}
          value={value.heroAlt}
          onChange={(e) => set("heroAlt", e.target.value)}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Gallery JSON
        </span>
        <textarea
          className={`${inputClass} min-h-40 font-mono text-xs`}
          value={value.imagesJson}
          onChange={(e) => set("imagesJson", e.target.value)}
          spellCheck={false}
        />
        <input
          ref={galleryFileRef}
          type="file"
          accept="image/*"
          className="mt-2 block w-full text-sm text-charcoal/70"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onGalleryUpload(file);
          }}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Pieces JSON (optional)
        </span>
        <textarea
          className={`${inputClass} min-h-24 font-mono text-xs`}
          value={value.piecesJson}
          onChange={(e) => set("piecesJson", e.target.value)}
          spellCheck={false}
          placeholder="Leave blank unless Built-in style pairs"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
          Capstone JSON (optional)
        </span>
        <textarea
          className={`${inputClass} min-h-24 font-mono text-xs`}
          value={value.capstoneJson}
          onChange={(e) => set("capstoneJson", e.target.value)}
          spellCheck={false}
          placeholder="Leave blank unless Capstone case study"
        />
      </label>
    </div>
  );
}
