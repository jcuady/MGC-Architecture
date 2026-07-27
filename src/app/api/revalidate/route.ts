import { createClient as createAnonClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Called by the admin studio after saving content so edits go live immediately.
 * Accepts a cookie session (browser) or Authorization: Bearer <access_token>
 * (scripts / e2e) — one seam for both.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  let user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (token) {
      const anon = createAnonClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      user = (await anon.auth.getUser(token)).data.user;
    }
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/estimate");
  return NextResponse.json({ revalidated: true });
}
