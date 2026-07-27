import InquiriesTable, { type Inquiry } from "@/components/studio/InquiriesTable";
import { createClient } from "@/lib/supabase/server";

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <h1 className="font-heading text-2xl font-semibold text-charcoal">
        Inquiries &amp; Bookings
      </h1>
      <p className="mt-1 text-sm text-charcoal/70">
        Everything submitted through the website&apos;s consultation form. Update the
        status as you contact and book each client.
      </p>

      <InquiriesTable initial={(data ?? []) as Inquiry[]} />
    </>
  );
}
