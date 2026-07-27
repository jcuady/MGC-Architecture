"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fontOptions,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type SectionKey,
  type TextStyle,
} from "@/lib/cms";
import SectionPreview, {
  deviceWidths,
  type Device,
} from "./SectionPreview";

// WordPress/Elementor-style editor: fields panel on the left, a live preview
// of the real landing component on the right. No dragging — only text, image,
// and typography (brand fonts + size) can change, so the layout stays intact.

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const inputClass =
  "w-full border border-warm-gray bg-white px-3.5 py-2.5 font-heading text-sm text-charcoal focus:border-chestnut focus:outline-none";

function humanize(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function isImageValue(key: string, value: string) {
  return (
    key.toLowerCase().includes("image") ||
    /\.(png|jpe?g|webp|avif|gif)$/i.test(value) ||
    value.includes("/storage/v1/object/public/")
  );
}

function setAtPath(root: Json, path: (string | number)[], value: Json): Json {
  const clone = structuredClone(root);
  let node: Json = clone;
  for (let i = 0; i < path.length - 1; i++) {
    node = (node as Record<string | number, Json>)[path[i]];
  }
  (node as Record<string | number, Json>)[path[path.length - 1]] = value;
  return clone;
}

/** Blank copy of an item, used when adding rows to a repeatable list. */
function blankOf(template: Json): Json {
  if (typeof template === "string") return "";
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  if (Array.isArray(template)) return [];
  if (template && typeof template === "object") {
    return Object.fromEntries(
      Object.entries(template).map(([k, v]) => [k, blankOf(v)]),
    );
  }
  return null;
}

type EditorProps = {
  sectionKey: SectionKey;
  label: string;
  initial: Json;
  isCustomized: boolean;
};

export default function SectionEditor({
  sectionKey,
  label,
  initial,
  isCustomized,
}: EditorProps) {
  const router = useRouter();
  const [value, setValue] = useState<Json>(initial);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [device, setDevice] = useState<Device>("desktop");
  // Deferred draft keeps typing responsive while the preview re-renders.
  const previewValue = useDeferredValue(value);

  function update(path: (string | number)[], next: Json) {
    setValue((current) => setAtPath(current, path, next));
    setDirty(true);
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase.from("site_content").upsert({
      key: sectionKey,
      data: value,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      setStatus("error");
      return;
    }
    const rev = await fetch("/api/revalidate", { method: "POST" });
    if (!rev.ok) {
      setStatus("error");
      return;
    }
    setStatus("saved");
    setDirty(false);
    router.refresh();
  }

  async function resetToOriginal() {
    if (
      !window.confirm(
        "Reset this section to the original copy? Your customizations will be removed.",
      )
    ) {
      return;
    }
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase
      .from("site_content")
      .delete()
      .eq("key", sectionKey);
    if (error) {
      setStatus("error");
      return;
    }
    await fetch("/api/revalidate", { method: "POST" });
    window.location.reload();
  }

  const record = (value ?? {}) as Record<string, Json>;
  const styles = record.styles as Record<string, TextStyle> | undefined;
  const contentEntries = Object.entries(record).filter(([key]) => key !== "styles");

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      {/* ------------------------------------------------ fields panel */}
      <div className="w-full border border-warm-gray/70 bg-white xl:w-[400px] xl:shrink-0">
        <div className="flex items-center justify-between gap-3 border-b border-warm-gray/70 bg-beige/60 px-5 py-4">
          <div>
            <h2 className="font-heading text-sm font-semibold text-charcoal">{label}</h2>
            <p className="font-heading text-xs text-charcoal/55">
              {dirty ? "Unsaved changes" : "All changes published"}
            </p>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={status === "saving" || !dirty}
            className="bg-chestnut px-5 py-2.5 font-heading text-xs font-semibold text-warm-white transition-colors hover:bg-terracotta disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "saving" ? "Publishing…" : "Save & publish"}
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
          {styles && Object.keys(styles).length > 0 && (
            <TypographyPanel
              styles={styles}
              onChange={(field, next) => update(["styles", field], next as Json)}
            />
          )}

          {contentEntries.map(([key, child]) => (
            <Field
              key={key}
              value={child}
              path={[key]}
              keyName={key}
              onChange={update}
              sectionKey={sectionKey}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-warm-gray/70 px-5 py-4">
          <span role="status" className="font-heading text-xs">
            {status === "saved" && (
              <span className="text-military">Published — live on the site.</span>
            )}
            {status === "error" && (
              <span className="text-terracotta">Couldn&apos;t save. Try again.</span>
            )}
          </span>
          {isCustomized && (
            <button
              type="button"
              onClick={resetToOriginal}
              className="ml-auto font-heading text-xs font-semibold text-charcoal/55 underline-offset-2 hover:text-terracotta hover:underline"
            >
              Reset to original
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------ live preview */}
      <div className="min-w-0 flex-1 xl:sticky xl:top-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/55">
            Live preview
          </p>
          <div className="flex border border-warm-gray/70 bg-white" role="group" aria-label="Preview device">
            {(Object.keys(deviceWidths) as Device[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                aria-pressed={device === d}
                className={`px-4 py-2 font-heading text-xs font-semibold capitalize transition-colors ${
                  device === d
                    ? "bg-charcoal text-warm-white"
                    : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <SectionPreview sectionKey={sectionKey} data={previewValue} device={device} />
        <p className="mt-2 font-heading text-xs text-charcoal/45">
          Exact render of the live section — updates as you type. Nothing publishes
          until you save.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Typography: brand fonts only (Poppins / Lora), adjustable size      */
/* ------------------------------------------------------------------ */

function TypographyPanel({
  styles,
  onChange,
}: {
  styles: Record<string, TextStyle>;
  onChange: (field: string, next: TextStyle) => void;
}) {
  return (
    <fieldset className="border border-warm-gray/70 bg-beige/40 p-4">
      <legend className="px-2 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-chestnut">
        Typography
      </legend>
      <p className="font-heading text-xs leading-relaxed text-charcoal/55">
        Fonts are limited to the two brand typefaces. Leave size empty to keep the
        designed responsive size.
      </p>
      <div className="mt-4 space-y-4">
        {Object.entries(styles).map(([field, style]) => (
          <div key={field} className="border-l-2 border-warm-gray/70 pl-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-charcoal/70">
                {humanize(field)}
              </span>
              {(style.font || style.size || style.italic !== undefined) && (
                <button
                  type="button"
                  onClick={() => onChange(field, {})}
                  className="font-heading text-[0.65rem] font-semibold text-charcoal/45 hover:text-terracotta"
                >
                  Use default
                </button>
              )}
            </div>
            <div className="mt-2 grid grid-cols-[1fr_5.5rem_auto] items-center gap-2">
              <select
                aria-label={`${humanize(field)} font`}
                value={style.font ?? ""}
                onChange={(e) =>
                  onChange(field, {
                    ...style,
                    font: (e.target.value || undefined) as TextStyle["font"],
                  })
                }
                className={inputClass}
              >
                <option value="">Default font</option>
                {fontOptions.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                aria-label={`${humanize(field)} size in pixels`}
                placeholder="Size"
                min={FONT_SIZE_MIN}
                max={FONT_SIZE_MAX}
                value={style.size ?? ""}
                onChange={(e) =>
                  onChange(field, {
                    ...style,
                    size: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className={inputClass}
              />
              <label className="flex cursor-pointer items-center gap-1.5 font-heading text-xs text-charcoal/70">
                <input
                  type="checkbox"
                  checked={style.italic ?? false}
                  onChange={(e) =>
                    onChange(field, {
                      ...style,
                      italic: e.target.checked ? true : undefined,
                    })
                  }
                  className="h-4 w-4 accent-[#753627]"
                />
                Italic
              </label>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Generic content fields                                              */
/* ------------------------------------------------------------------ */

type FieldProps = {
  value: Json;
  path: (string | number)[];
  keyName: string;
  onChange: (path: (string | number)[], value: Json) => void;
  sectionKey: string;
};

function Field({ value, path, keyName, onChange, sectionKey }: FieldProps) {
  if (typeof value === "string") {
    if (isImageValue(String(path[path.length - 1] ?? keyName), value)) {
      return (
        <ImageField
          label={humanize(keyName)}
          value={value}
          sectionKey={sectionKey}
          onChange={(v) => onChange(path, v)}
        />
      );
    }
    const long = value.length > 90 || value.includes("\n");
    return (
      <label className="block">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
          {humanize(keyName)}
        </span>
        {long ? (
          <textarea
            value={value}
            rows={Math.min(8, Math.max(3, Math.ceil(value.length / 90)))}
            onChange={(e) => onChange(path, e.target.value)}
            className={inputClass}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
            className={inputClass}
          />
        )}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block">
        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
          {humanize(keyName)}
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(path, Number(e.target.value))}
          className={inputClass}
        />
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <fieldset className="border border-warm-gray/70 bg-white p-4">
        <legend className="px-2 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-chestnut">
          {humanize(keyName)}
        </legend>
        <div className="space-y-4">
          {value.map((item, i) => (
            <div key={i} className="relative border-l-2 border-warm-gray/70 pl-4">
              <Field
                value={item}
                path={[...path, i]}
                keyName={`${humanize(keyName)} ${i + 1}`}
                onChange={onChange}
                sectionKey={sectionKey}
              />
              <button
                type="button"
                onClick={() =>
                  onChange(
                    path,
                    value.filter((_, j) => j !== i),
                  )
                }
                className="mt-2 font-heading text-xs font-semibold text-terracotta hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange(path, [...value, blankOf(value[0] ?? "")])}
            className="border border-dashed border-warm-gray px-4 py-2 font-heading text-xs font-semibold text-charcoal/60 transition-colors hover:border-chestnut hover:text-chestnut"
          >
            + Add item
          </button>
        </div>
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    return (
      <fieldset className="border border-warm-gray/70 bg-white p-4">
        <legend className="px-2 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-chestnut">
          {humanize(keyName)}
        </legend>
        <div className="space-y-5">
          {Object.entries(value).map(([key, child]) => (
            <Field
              key={key}
              value={child}
              path={[...path, key]}
              keyName={key}
              onChange={onChange}
              sectionKey={sectionKey}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  return null;
}

function ImageField({
  label,
  value,
  sectionKey,
  onChange,
}: {
  label: string;
  value: string;
  sectionKey: string;
  onChange: (value: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `${sectionKey}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("site")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setError("Upload failed. Try a smaller image or check your connection.");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("site").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="border border-warm-gray/70 bg-white p-4">
      <span className="block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
        {label}
      </span>
      <div className="mt-3 flex flex-wrap items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary storage URLs */}
        <img
          src={value}
          alt="Current selection"
          className="h-24 w-36 border border-warm-gray/60 object-cover"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} URL`}
            className={inputClass}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="border border-chestnut px-4 py-2 font-heading text-xs font-semibold text-chestnut transition-colors hover:bg-chestnut hover:text-warm-white disabled:cursor-wait disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload new image"}
          </button>
          {error && <p className="text-xs text-terracotta">{error}</p>}
        </div>
      </div>
    </div>
  );
}
