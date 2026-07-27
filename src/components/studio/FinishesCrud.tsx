"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  formatPhp,
  slugifyFinish,
  type FinishRate,
} from "@/lib/calculator";

const inputClass =
  "w-full border border-warm-gray bg-white px-3.5 py-2.5 font-heading text-sm text-charcoal focus:border-chestnut focus:outline-none";

type Draft = {
  name: string;
  description: string;
  rate_per_sqm: string;
  sort_order: string;
  is_active: boolean;
};

const emptyDraft = (): Draft => ({
  name: "",
  description: "",
  rate_per_sqm: "",
  sort_order: "50",
  is_active: true,
});

export default function FinishesCrud({ initial }: { initial: FinishRate[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Draft | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function createRow() {
    setMessage(null);
    const name = draft.name.trim();
    const rate = Number(draft.rate_per_sqm);
    const sort = Number(draft.sort_order);
    if (!name || !(rate > 0) || !Number.isFinite(sort)) {
      setMessage("Name and a rate above ₱0 are required.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    const supabase = createClient();
    const slug = slugifyFinish(name) || `finish-${Date.now()}`;
    const { data, error } = await supabase
      .from("finish_rates")
      .insert({
        name,
        slug,
        description: draft.description.trim(),
        rate_per_sqm: rate,
        sort_order: sort,
        is_active: draft.is_active,
      })
      .select("id, name, slug, description, rate_per_sqm, sort_order, is_active")
      .single();
    if (error || !data) {
      setStatus("error");
      setMessage(error?.message.includes("duplicate")
        ? "A finish with that name already exists."
        : "Couldn't add the finish. Try again.");
      return;
    }
    setRows((prev) =>
      [...prev, {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        rate_per_sqm: Number(data.rate_per_sqm),
        sort_order: Number(data.sort_order),
        is_active: Boolean(data.is_active),
      }].sort((a, b) => a.sort_order - b.sort_order),
    );
    setDraft(emptyDraft());
    setStatus("idle");
    setMessage("Finish added — live on the estimator.");
    await fetch("/api/revalidate", { method: "POST" });
    router.refresh();
  }

  function startEdit(row: FinishRate) {
    setEditingId(row.id);
    setEdit({
      name: row.name,
      description: row.description,
      rate_per_sqm: String(row.rate_per_sqm),
      sort_order: String(row.sort_order),
      is_active: row.is_active,
    });
    setMessage(null);
  }

  async function saveEdit(id: string) {
    if (!edit) return;
    setMessage(null);
    const name = edit.name.trim();
    const rate = Number(edit.rate_per_sqm);
    const sort = Number(edit.sort_order);
    if (!name || !(rate > 0) || !Number.isFinite(sort)) {
      setMessage("Name and a rate above ₱0 are required.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase
      .from("finish_rates")
      .update({
        name,
        slug: slugifyFinish(name) || undefined,
        description: edit.description.trim(),
        rate_per_sqm: rate,
        sort_order: sort,
        is_active: edit.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      setStatus("error");
      setMessage("Couldn't save changes. Try again.");
      return;
    }
    setRows((prev) =>
      prev
        .map((r) =>
          r.id === id
            ? {
                ...r,
                name,
                slug: slugifyFinish(name) || r.slug,
                description: edit.description.trim(),
                rate_per_sqm: rate,
                sort_order: sort,
                is_active: edit.is_active,
              }
            : r,
        )
        .sort((a, b) => a.sort_order - b.sort_order),
    );
    setEditingId(null);
    setEdit(null);
    setStatus("idle");
    setMessage("Changes saved — estimator updated.");
    await fetch("/api/revalidate", { method: "POST" });
    router.refresh();
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete “${name}” permanently? Visitors will no longer see it.`)) {
      return;
    }
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.from("finish_rates").delete().eq("id", id);
    if (error) {
      setStatus("error");
      setMessage("Couldn't delete. Try again.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    setMessage("Finish removed.");
    await fetch("/api/revalidate", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-6">
      {message && (
        <p
          role="status"
          className={`font-heading text-sm ${
            status === "error" ? "text-terracotta" : "text-military"
          }`}
        >
          {message}
        </p>
      )}

      {/* Desktop/tablet table */}
      <div className="hidden overflow-x-auto border border-warm-gray/70 bg-white md:block">
        <table className="w-full min-w-[40rem] text-left">
          <thead className="border-b border-warm-gray/70 bg-beige/50">
            <tr className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
              <th className="px-4 py-3">Finish</th>
              <th className="px-4 py-3">Rate / sqm</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) =>
              editingId === row.id && edit ? (
                <tr key={row.id} className="border-b border-warm-gray/50 bg-beige/30">
                  <td className="px-4 py-3">
                    <input
                      className={inputClass}
                      value={edit.name}
                      onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                      aria-label="Finish name"
                    />
                    <textarea
                      className={`${inputClass} mt-2`}
                      rows={2}
                      value={edit.description}
                      onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                      aria-label="Finish description shown on the estimator"
                      placeholder="Short description shown on the estimator"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={1}
                      step="0.01"
                      className={inputClass}
                      value={edit.rate_per_sqm}
                      onChange={(e) =>
                        setEdit({ ...edit, rate_per_sqm: e.target.value })
                      }
                      aria-label="Rate per sqm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      className={inputClass}
                      value={edit.sort_order}
                      onChange={(e) =>
                        setEdit({ ...edit, sort_order: e.target.value })
                      }
                      aria-label="Sort order"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex items-center gap-2 font-heading text-sm">
                      <input
                        type="checkbox"
                        checked={edit.is_active}
                        onChange={(e) =>
                          setEdit({ ...edit, is_active: e.target.checked })
                        }
                        className="h-4 w-4 accent-[#753627]"
                      />
                      Active
                    </label>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={status === "saving"}
                        onClick={() => saveEdit(row.id)}
                        className="bg-chestnut px-3 py-2 font-heading text-xs font-semibold text-warm-white hover:bg-terracotta disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEdit(null);
                        }}
                        className="border border-warm-gray px-3 py-2 font-heading text-xs font-semibold text-charcoal/70"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={row.id} className="border-b border-warm-gray/50">
                  <td className="px-4 py-3 font-heading text-sm font-medium text-charcoal">
                    {row.name}
                    <span className="mt-0.5 block max-w-xs font-heading text-xs font-normal leading-relaxed text-charcoal/50">
                      {row.description || row.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-heading text-sm tabular-nums">
                    {formatPhp(row.rate_per_sqm)}
                  </td>
                  <td className="px-4 py-3 font-heading text-sm tabular-nums text-charcoal/70">
                    {row.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-heading text-xs font-semibold uppercase tracking-wide ${
                        row.is_active ? "text-military" : "text-charcoal/45"
                      }`}
                    >
                      {row.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="border border-chestnut px-3 py-2 font-heading text-xs font-semibold text-chestnut hover:bg-chestnut hover:text-warm-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(row.id, row.name)}
                        className="border border-terracotta/40 px-3 py-2 font-heading text-xs font-semibold text-terracotta hover:bg-terracotta hover:text-warm-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* Phone cards */}
      <ul className="space-y-4 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="border border-warm-gray/70 bg-white p-4">
            {editingId === row.id && edit ? (
              <div className="space-y-3">
                <input
                  className={inputClass}
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                  aria-label="Finish name"
                />
                <textarea
                  className={inputClass}
                  rows={2}
                  value={edit.description}
                  onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                  aria-label="Finish description shown on the estimator"
                  placeholder="Short description shown on the estimator"
                />
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  className={inputClass}
                  value={edit.rate_per_sqm}
                  onChange={(e) =>
                    setEdit({ ...edit, rate_per_sqm: e.target.value })
                  }
                  aria-label="Rate per sqm"
                />
                <input
                  type="number"
                  className={inputClass}
                  value={edit.sort_order}
                  onChange={(e) =>
                    setEdit({ ...edit, sort_order: e.target.value })
                  }
                  aria-label="Sort order"
                />
                <label className="flex items-center gap-2 font-heading text-sm">
                  <input
                    type="checkbox"
                    checked={edit.is_active}
                    onChange={(e) =>
                      setEdit({ ...edit, is_active: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#753627]"
                  />
                  Active on calculator
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveEdit(row.id)}
                    className="flex-1 bg-chestnut px-3 py-3 font-heading text-xs font-semibold text-warm-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEdit(null);
                    }}
                    className="flex-1 border border-warm-gray px-3 py-3 font-heading text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-base font-semibold text-charcoal">
                      {row.name}
                    </p>
                    <p className="mt-1 font-heading text-sm tabular-nums text-charcoal/70">
                      {formatPhp(row.rate_per_sqm)}/sqm
                    </p>
                  </div>
                  <span
                    className={`font-heading text-xs font-semibold uppercase ${
                      row.is_active ? "text-military" : "text-charcoal/45"
                    }`}
                  >
                    {row.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="min-h-11 flex-1 border border-chestnut font-heading text-xs font-semibold text-chestnut"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(row.id, row.name)}
                    className="min-h-11 flex-1 border border-terracotta/40 font-heading text-xs font-semibold text-terracotta"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Create */}
      <fieldset className="border border-warm-gray/70 bg-white p-5 sm:p-6">
        <legend className="px-2 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-chestnut">
          Add finish
        </legend>
        <p className="text-sm text-charcoal/65">
          New finishes appear on the public calculator immediately after save.
          Set order lower to show earlier in the list.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
              Name
            </span>
            <input
              className={inputClass}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Mid-range Finish"
            />
          </label>
          <label className="block sm:col-span-2 lg:col-span-3">
            <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
              Description (shown on the estimator)
            </span>
            <input
              className={inputClass}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="How this finish level feels to live in"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
              Rate / sqm (₱)
            </span>
            <input
              type="number"
              min={1}
              step="0.01"
              className={inputClass}
              value={draft.rate_per_sqm}
              onChange={(e) =>
                setDraft({ ...draft, rate_per_sqm: e.target.value })
              }
              placeholder="55000"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
              Sort order
            </span>
            <input
              type="number"
              className={inputClass}
              value={draft.sort_order}
              onChange={(e) =>
                setDraft({ ...draft, sort_order: e.target.value })
              }
            />
          </label>
          <div className="flex items-end gap-4">
            <label className="flex min-h-11 items-center gap-2 font-heading text-sm">
              <input
                type="checkbox"
                checked={draft.is_active}
                onChange={(e) =>
                  setDraft({ ...draft, is_active: e.target.checked })
                }
                className="h-4 w-4 accent-[#753627]"
              />
              Active
            </label>
            <button
              type="button"
              disabled={status === "saving"}
              onClick={createRow}
              className="min-h-11 flex-1 bg-chestnut px-4 font-heading text-sm font-semibold text-warm-white transition-colors hover:bg-terracotta disabled:opacity-50"
            >
              {status === "saving" ? "Saving…" : "Add finish"}
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
