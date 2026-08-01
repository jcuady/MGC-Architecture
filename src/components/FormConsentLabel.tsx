import Link from "next/link";

/** Shared consent copy with legal links for customer forms. */
export default function FormConsentLabel({
  id,
  checked,
  onChange,
  error,
}: {
  id: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  error?: string | null;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          aria-invalid={Boolean(error)}
          className="mt-1 h-4 w-4 accent-chestnut"
        />
        <span className="font-body text-sm text-charcoal/80">
          I agree to be contacted about my project and accept the{" "}
          <Link href="/privacy" className="font-semibold text-chestnut underline-offset-2 hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="font-semibold text-chestnut underline-offset-2 hover:underline">
            Terms of Use
          </Link>
          . *
        </span>
      </label>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
}
