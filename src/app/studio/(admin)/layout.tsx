import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Sidebar from "@/components/studio/Sidebar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "MGC Studio — Admin",
  robots: { index: false, follow: false },
};

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/studio/login");

  return (
    <div className="flex min-h-dvh flex-col bg-warm-white lg:flex-row">
      <Sidebar email={user.email ?? ""} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
