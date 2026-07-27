"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const fields = new FormData(event.currentTarget);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(fields.get("username") ?? "").trim(),
      password: String(fields.get("password") ?? ""),
    });

    if (signInError) {
      setError("Wrong username or password. Check both and try again.");
      setSubmitting(false);
      return;
    }

    router.push("/studio");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-chestnut px-5">
      <Image
        src="/brand/monogram-white.png"
        alt=""
        aria-hidden
        width={900}
        height={900}
        className="pointer-events-none absolute -bottom-48 -right-40 w-[40rem] opacity-[0.06]"
      />

      <div className="relative w-full max-w-md bg-warm-white p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/monogram-chestnut.png"
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 object-contain"
          />
          <div>
            <p className="font-heading text-sm font-semibold leading-tight text-charcoal">
              mgc architecture
            </p>
            <p className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
              Studio
            </p>
          </div>
        </div>

        <h1 className="mt-8 font-heading text-2xl font-semibold text-charcoal">
          Sign in to the studio
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
          Manage inquiries, bookings, and the website content.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="email"
              required
              autoComplete="username"
              className="w-full border border-warm-gray bg-white px-4 py-3 font-heading text-sm text-charcoal focus:border-chestnut focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-warm-gray bg-white px-4 py-3 font-heading text-sm text-charcoal focus:border-chestnut focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="border-l-2 border-terracotta bg-beige px-4 py-3 text-sm text-charcoal">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-chestnut px-7 py-3.5 font-heading text-sm font-semibold text-warm-white transition-colors hover:bg-terracotta disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
