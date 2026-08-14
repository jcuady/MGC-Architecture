"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugifyBlog, type BlogPost } from "@/lib/blog";

const inputClass =
  "w-full border border-warm-gray bg-white px-3.5 py-2.5 font-heading text-sm text-charcoal focus:border-chestnut focus:outline-none";

type Draft = {
  title: string;
  excerpt: string;
  body: string;
  cover_image: string;
  cover_alt: string;
  read_mins: string;
  sort_order: string;
  is_published: boolean;
};

const emptyDraft = (): Draft => ({
  title: "",
  excerpt: "",
  body: "",
  cover_image: "",
  cover_alt: "",
  read_mins: "3",
  sort_order: "50",
  is_published: true,
});

function draftFromPost(p: BlogPost): Draft {
  return {
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    cover_image: p.cover_image,
    cover_alt: p.cover_alt,
    read_mins: String(p.read_mins),
    sort_order: String(p.sort_order),
    is_published: p.is_published,
  };
}

export default function BlogCrud({ initial }: { initial: BlogPost[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Draft | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const createFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  async function revalidate() {
    await fetch("/api/revalidate", { method: "POST" });
    router.refresh();
  }

  async function uploadCover(
    file: File,
    onUrl: (url: string) => void,
  ): Promise<boolean> {
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `blog/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("site").upload(path, file, {
      upsert: true,
    });
    if (error) {
      setStatus("error");
      setMessage("Cover upload failed. Try a smaller image.");
      return false;
    }
    const { data } = supabase.storage.from("site").getPublicUrl(path);
    onUrl(data.publicUrl);
    return true;
  }

  function validate(d: Draft): string | null {
    if (!d.title.trim()) return "Title is required.";
    if (!d.body.trim()) return "Body is required.";
    const mins = Number(d.read_mins);
    const sort = Number(d.sort_order);
    if (!(mins > 0) || !Number.isFinite(sort)) {
      return "Read time must be above 0 and sort order must be a number.";
    }
    return null;
  }

  async function createRow() {
    setMessage(null);
    const err = validate(draft);
    if (err) {
      setMessage(err);
      setStatus("error");
      return;
    }
    setStatus("saving");
    const supabase = createClient();
    const slug = slugifyBlog(draft.title) || `post-${Date.now()}`;
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: draft.title.trim(),
        slug,
        excerpt: draft.excerpt.trim(),
        body: draft.body.trim(),
        cover_image: draft.cover_image.trim(),
        cover_alt: draft.cover_alt.trim(),
        read_mins: Number(draft.read_mins),
        sort_order: Number(draft.sort_order),
        is_published: draft.is_published,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(
        "id, title, slug, excerpt, body, cover_image, cover_alt, read_mins, sort_order, is_published, published_at",
      )
      .single();
    if (error || !data) {
      setStatus("error");
      setMessage(
        error?.message.includes("duplicate")
          ? "A post with that title/slug already exists."
          : "Couldn't create the post. Is the blog_posts table migrated?",
      );
      return;
    }
    setRows((prev) =>
      [...prev, data as BlogPost].sort((a, b) => a.sort_order - b.sort_order),
    );
    setDraft(emptyDraft());
    setStatus("idle");
    setMessage("Post published to /blog.");
    await revalidate();
  }

  function startEdit(row: BlogPost) {
    setEditingId(row.id);
    setEdit(draftFromPost(row));
    setMessage(null);
  }

  async function saveEdit(id: string) {
    if (!edit) return;
    setMessage(null);
    const err = validate(edit);
    if (err) {
      setMessage(err);
      setStatus("error");
      return;
    }
    setStatus("saving");
    const supabase = createClient();
    const slug = slugifyBlog(edit.title) || undefined;
    const wasPublished = rows.find((r) => r.id === id)?.is_published;
    const patch: Record<string, unknown> = {
      title: edit.title.trim(),
      slug,
      excerpt: edit.excerpt.trim(),
      body: edit.body.trim(),
      cover_image: edit.cover_image.trim(),
      cover_alt: edit.cover_alt.trim(),
      read_mins: Number(edit.read_mins),
      sort_order: Number(edit.sort_order),
      is_published: edit.is_published,
      updated_at: new Date().toISOString(),
    };
    if (edit.is_published && !wasPublished) {
      patch.published_at = new Date().toISOString();
    }
    const { error } = await supabase
      .from("blog_posts")
      .update(patch)
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
            ? {
                ...r,
                title: edit.title.trim(),
                slug: slug ?? r.slug,
                excerpt: edit.excerpt.trim(),
                body: edit.body.trim(),
                cover_image: edit.cover_image.trim(),
                cover_alt: edit.cover_alt.trim(),
                read_mins: Number(edit.read_mins),
                sort_order: Number(edit.sort_order),
                is_published: edit.is_published,
              }
            : r,
        )
        .sort((a, b) => a.sort_order - b.sort_order),
    );
    setEditingId(null);
    setEdit(null);
    setStatus("idle");
    setMessage("Post updated.");
    await revalidate();
  }

  async function removeRow(id: string, title: string) {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
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
    setMessage("Post deleted.");
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

      {/* Create */}
      <section className="border border-warm-gray/80 bg-beige/40 p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold text-charcoal">
          New post
        </h2>
        <p className="mt-1 text-sm text-charcoal/65">
          Body paragraphs: separate with a blank line. Mistakes/tips can start a
          line with a bold-style title then a newline.
        </p>
        <PostForm
          value={draft}
          onChange={setDraft}
          fileRef={createFileRef}
          onUpload={async (file) => {
            await uploadCover(file, (url) =>
              setDraft((d) => ({ ...d, cover_image: url })),
            );
          }}
        />
        <button
          type="button"
          onClick={createRow}
          disabled={status === "saving"}
          className="mt-5 inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-terracotta disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Create post"}
        </button>
      </section>

      {/* List */}
      <ul className="space-y-4">
        {rows.map((row) => (
          <li
            key={row.id}
            className="border border-warm-gray/80 bg-white p-4 sm:p-5"
          >
            {editingId === row.id && edit ? (
              <div>
                <PostForm
                  value={edit}
                  onChange={setEdit}
                  fileRef={editFileRef}
                  onUpload={async (file) => {
                    await uploadCover(file, (url) =>
                      setEdit((d) => (d ? { ...d, cover_image: url } : d)),
                    );
                  }}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => saveEdit(row.id)}
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
                {row.cover_image ? (
                  <div className="relative h-24 w-36 shrink-0 overflow-hidden bg-beige">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.cover_image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-base font-semibold text-charcoal">
                      {row.title}
                    </h3>
                    <span
                      className={`font-heading text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${
                        row.is_published ? "text-military" : "text-charcoal/40"
                      }`}
                    >
                      {row.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 font-heading text-xs text-charcoal/50">
                    /blog/{row.slug} · {row.read_mins} min · sort {row.sort_order}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">
                    {row.excerpt || row.body.slice(0, 140)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`/blog/${row.slug}`}
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
                      onClick={() => removeRow(row.id, row.title)}
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

      {rows.length === 0 ? (
        <p className="text-sm text-charcoal/60">
          No posts in the database yet. Create one above, or run migration
          0004_blog_posts.sql to seed blog.md.
        </p>
      ) : null}
    </div>
  );
}

function PostForm({
  value,
  onChange,
  fileRef,
  onUpload,
}: {
  value: Draft;
  onChange: (d: Draft) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (file: File) => Promise<void>;
}) {
  return (
    <div className="mt-5 grid gap-4">
      <label className="block">
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
          Title
        </span>
        <input
          className={`${inputClass} mt-1.5`}
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
          Excerpt
        </span>
        <textarea
          rows={2}
          className={`${inputClass} mt-1.5 resize-y font-body`}
          value={value.excerpt}
          onChange={(e) => onChange({ ...value, excerpt: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
          Body
        </span>
        <textarea
          rows={10}
          className={`${inputClass} mt-1.5 resize-y font-body leading-relaxed`}
          value={value.body}
          onChange={(e) => onChange({ ...value, body: e.target.value })}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
            Cover image URL
          </span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <input
              className={`${inputClass} min-w-0 flex-1`}
              value={value.cover_image}
              onChange={(e) =>
                onChange({ ...value, cover_image: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex min-h-11 cursor-pointer items-center border border-warm-gray px-4 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal"
            >
              Upload
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onUpload(file);
                e.target.value = "";
              }}
            />
          </div>
          {value.cover_image ? (
            <div className="relative mt-3 h-32 w-48 overflow-hidden bg-beige">
              <Image
                src={value.cover_image}
                alt=""
                fill
                className="object-cover"
                sizes="192px"
                unoptimized={value.cover_image.includes("supabase")}
              />
            </div>
          ) : null}
        </label>
        <label className="block">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
            Cover alt text
          </span>
          <input
            className={`${inputClass} mt-1.5`}
            value={value.cover_alt}
            onChange={(e) => onChange({ ...value, cover_alt: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
            Read time (minutes)
          </span>
          <input
            type="number"
            min={1}
            className={`${inputClass} mt-1.5`}
            value={value.read_mins}
            onChange={(e) => onChange({ ...value, read_mins: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
            Sort order
          </span>
          <input
            type="number"
            className={`${inputClass} mt-1.5`}
            value={value.sort_order}
            onChange={(e) => onChange({ ...value, sort_order: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            checked={value.is_published}
            onChange={(e) =>
              onChange({ ...value, is_published: e.target.checked })
            }
            className="h-4 w-4 accent-chestnut"
          />
          <span className="font-heading text-sm text-charcoal">Published</span>
        </label>
      </div>
    </div>
  );
}
