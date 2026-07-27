"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  location: string | null;
  budget: string | null;
  preferred_date: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
};

const statuses = ["new", "contacted", "booked", "archived"] as const;
const filters = ["all", ...statuses] as const;

export default function InquiriesTable({ initial }: { initial: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initial);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible =
    filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  async function updateStatus(id: string, status: string) {
    setError(null);
    const previous = inquiries;
    setInquiries((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id);
    if (updateError) {
      setInquiries(previous);
      setError("Couldn't update the status. Try again.");
    }
  }

  async function saveNotes(id: string, admin_notes: string) {
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("inquiries")
      .update({ admin_notes })
      .eq("id", id);
    if (updateError) {
      setError("Couldn't save the note. Try again.");
      return;
    }
    setInquiries((rows) => rows.map((r) => (r.id === id ? { ...r, admin_notes } : r)));
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    setError(null);
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("inquiries").delete().eq("id", id);
    if (deleteError) {
      setError("Couldn't delete the inquiry. Try again.");
      return;
    }
    setInquiries((rows) => rows.filter((r) => r.id !== id));
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`border px-4 py-2 font-heading text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? "border-chestnut bg-chestnut text-warm-white"
                : "border-warm-gray bg-white text-charcoal/70 hover:border-chestnut hover:text-chestnut"
            }`}
          >
            {f}
            {f !== "all" && (
              <span className="ml-1.5 opacity-70">
                {inquiries.filter((i) => i.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 border-l-2 border-terracotta bg-white px-4 py-3 text-sm text-charcoal">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="mt-6 border border-dashed border-warm-gray bg-white p-10 text-center text-sm text-charcoal/60">
          {filter === "all"
            ? "No inquiries yet. New submissions from the website's contact form will appear here."
            : `No ${filter} inquiries.`}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((inquiry) => {
            const open = openId === inquiry.id;
            return (
              <li key={inquiry.id} className="border border-warm-gray/70 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : inquiry.id)}
                  aria-expanded={open}
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-heading font-semibold text-charcoal">
                      {inquiry.name}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-charcoal/60">
                      {inquiry.service ?? "General inquiry"} ·{" "}
                      {new Date(inquiry.created_at).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className={`inline-block border px-2.5 py-1 font-heading text-xs font-semibold capitalize ${
                        inquiry.status === "new"
                          ? "border-gold/40 bg-gold/15 text-[#7a5c1e]"
                          : inquiry.status === "booked"
                            ? "border-chestnut/30 bg-chestnut/10 text-chestnut"
                            : inquiry.status === "contacted"
                              ? "border-military/30 bg-military/10 text-military"
                              : "border-warm-gray bg-warm-gray/40 text-charcoal/60"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                    <span aria-hidden className="font-heading text-charcoal/40">
                      {open ? "−" : "+"}
                    </span>
                  </span>
                </button>

                {open && (
                  <div className="border-t border-warm-gray/60 px-5 py-5">
                    <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <Meta label="Email">
                        <a href={`mailto:${inquiry.email}`} className="text-chestnut underline">
                          {inquiry.email}
                        </a>
                      </Meta>
                      <Meta label="Phone">{inquiry.phone ?? "—"}</Meta>
                      <Meta label="Location">{inquiry.location ?? "—"}</Meta>
                      <Meta label="Budget">{inquiry.budget ?? "—"}</Meta>
                      <Meta label="Preferred date">{inquiry.preferred_date ?? "—"}</Meta>
                      <Meta label="Received">
                        {new Date(inquiry.created_at).toLocaleString("en-PH")}
                      </Meta>
                    </dl>

                    <p className="mt-4 border-l-2 border-warm-gray bg-beige/60 px-4 py-3 text-sm leading-relaxed text-charcoal/85">
                      {inquiry.message}
                    </p>

                    <div className="mt-5 flex flex-wrap items-end gap-4">
                      <label className="block">
                        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                          Status
                        </span>
                        <select
                          value={inquiry.status}
                          onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                          className="border border-warm-gray bg-white px-3 py-2 font-heading text-sm capitalize focus:border-chestnut focus:outline-none"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block min-w-0 flex-1">
                        <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                          Notes (saved on blur)
                        </span>
                        <input
                          defaultValue={inquiry.admin_notes ?? ""}
                          onBlur={(e) => {
                            if (e.target.value !== (inquiry.admin_notes ?? "")) {
                              saveNotes(inquiry.id, e.target.value);
                            }
                          }}
                          placeholder="e.g. Called on Monday, sending estimate"
                          className="w-full border border-warm-gray bg-white px-3 py-2 font-heading text-sm focus:border-chestnut focus:outline-none"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => remove(inquiry.id)}
                        className="border border-terracotta/50 px-4 py-2 font-heading text-xs font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-warm-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">
        {label}
      </dt>
      <dd className="mt-0.5 text-charcoal/85">{children}</dd>
    </div>
  );
}
