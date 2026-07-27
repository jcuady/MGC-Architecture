import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { sectionMeta } from "@/lib/cms";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [inquiriesRes, contentRes, finishesRes] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id, created_at, name, service, status, preferred_date")
      .order("created_at", { ascending: false }),
    supabase.from("site_content").select("key"),
    supabase.from("finish_rates").select("id, is_active"),
  ]);

  const inquiries = inquiriesRes.data ?? [];
  const finishes = finishesRes.data ?? [];
  const stats = [
    {
      label: "New inquiries",
      value: inquiries.filter((i) => i.status === "new").length,
      href: "/studio/inquiries",
    },
    {
      label: "Booked consultations",
      value: inquiries.filter((i) => i.status === "booked").length,
      href: "/studio/inquiries",
    },
    {
      label: "Active finish rates",
      value: finishes.filter((f) => f.is_active).length,
      href: "/studio/finishes",
    },
    {
      label: "Customized sections",
      value: `${contentRes.data?.length ?? 0} / ${Object.keys(sectionMeta).length}`,
      href: "/studio/content",
    },
  ];

  const recent = inquiries.slice(0, 6);

  return (
    <>
      <h1 className="font-heading text-2xl font-semibold text-charcoal">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        What&apos;s happening across inquiries and the website.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-warm-gray/70 bg-white p-6 transition-colors hover:border-chestnut"
          >
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/55">
              {stat.label}
            </p>
            <p className="mt-3 font-heading text-3xl font-semibold text-chestnut">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold text-charcoal">
            Recent inquiries
          </h2>
          <Link
            href="/studio/inquiries"
            className="link-draw font-heading text-sm font-medium text-chestnut"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-6 border border-dashed border-warm-gray bg-white p-8 text-center text-sm text-charcoal/60">
            No inquiries yet. New submissions from the website&apos;s contact form will
            appear here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto border border-warm-gray/70 bg-white">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-warm-gray/70 font-heading text-xs uppercase tracking-[0.12em] text-charcoal/55">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Preferred date</th>
                  <th className="px-5 py-3 font-semibold">Received</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray/50">
                {recent.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td className="px-5 py-3.5 font-heading font-medium text-charcoal">
                      {inquiry.name}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/75">
                      {inquiry.service ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/75">
                      {inquiry.preferred_date ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/75">
                      {new Date(inquiry.created_at).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={inquiry.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-gold/15 text-[#7a5c1e] border-gold/40",
    contacted: "bg-military/10 text-military border-military/30",
    booked: "bg-chestnut/10 text-chestnut border-chestnut/30",
    archived: "bg-warm-gray/40 text-charcoal/60 border-warm-gray",
  };
  return (
    <span
      className={`inline-block border px-2.5 py-1 font-heading text-xs font-semibold capitalize ${styles[status] ?? styles.new}`}
    >
      {status}
    </span>
  );
}
