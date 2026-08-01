"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useState,
  useTransition,
  type ReactElement,
  type ReactNode,
} from "react";
import FormConsentLabel from "@/components/FormConsentLabel";
import { createClient } from "@/lib/supabase/client";
import {
  compileInquireMessage,
  emptyInquireAnswers,
  inquireServiceLabel,
  type InquireAnswers,
  type InquireContent,
} from "@/lib/inquire";
import { textStyle } from "@/lib/cms";
import {
  FORM_LIMITS,
  isBrowserOnline,
  submitErrorMessage,
  validateEmail,
  validateName,
  validatePhone,
  validateUploadFile,
} from "@/lib/form-validation";

const DRAFT_KEY = "mgc-inquire-draft-v1";

type ServiceOption = { title: string; scope: string[] };

const inputClass =
  "w-full border border-warm-gray bg-white px-4 py-3 font-heading text-sm text-charcoal placeholder:text-charcoal/40 focus:border-chestnut focus:outline-none";

const STEP_KEYS = [
  "aboutYou",
  "planning",
  "property",
  "budget",
  "inspiration",
  "details",
  "review",
] as const;

type StepKey = (typeof STEP_KEYS)[number];

async function uploadFiles(files: FileList | null): Promise<{ urls: string[]; error?: string }> {
  if (!files?.length) return { urls: [] };
  if (!isBrowserOnline()) {
    return { urls: [], error: "You're offline — reconnect before uploading files." };
  }
  const supabase = createClient();
  const urls: string[] = [];
  for (const file of Array.from(files).slice(0, FORM_LIMITS.uploadMaxFiles)) {
    const typeErr = validateUploadFile(file);
    if (typeErr) return { urls: [], error: typeErr };
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `inquiries/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("site").upload(path, file, {
      upsert: true,
    });
    if (error) return { urls: [], error: `Couldn't upload ${file.name}. Try a smaller file.` };
    const { data } = supabase.storage.from("site").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return { urls };
}

/**
 * Multi-step inquire wizard — copy from CMS, categories from services.
 * Submits into inquiries (service/location/budget + structured message).
 */
export default function InquireWizard({
  content,
  services,
  initialCategory = "",
}: {
  content: InquireContent;
  services: ServiceOption[];
  initialCategory?: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<InquireAnswers>(() => ({
    ...emptyInquireAnswers(),
    projectType: initialCategory,
  }));
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(isBrowserOnline());
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as InquireAnswers;
        setAnswers((prev) => ({
          ...prev,
          ...parsed,
          projectType: initialCategory || parsed.projectType || prev.projectType,
          propertyPhotos: [],
          inspirationUploads: [],
        }));
      }
    } catch {
      /* ignore bad draft */
    }
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore draft once on mount
  }, []);

  useEffect(() => {
    try {
      const draft = { ...answers, propertyPhotos: [], inspirationUploads: [] };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* private mode */
    }
  }, [answers]);

  const scopes = useMemo(() => {
    const match = services.find((s) => s.title === answers.projectType);
    return match?.scope ?? [];
  }, [services, answers.projectType]);

  function patch(partial: Partial<InquireAnswers>) {
    setAnswers((prev) => ({ ...prev, ...partial }));
  }

  function validateStep(index: number): string | null {
    const a = answers;
    switch (STEP_KEYS[index]) {
      case "aboutYou": {
        const nameErr = validateName(a.fullName);
        if (nameErr) return nameErr;
        const emailErr = validateEmail(a.email);
        if (emailErr) return emailErr;
        const phoneRequired = a.contactMethod === "Call" || a.contactMethod === "Text";
        const phoneErr = validatePhone(a.mobile, { required: phoneRequired });
        if (phoneErr) return phoneErr;
        if (
          (a.contactMethod === "Messenger" || a.contactMethod === "Viber") &&
          !a.contactDetails.trim()
        ) {
          return a.contactMethod === "Messenger"
            ? "Messenger profile link is required."
            : "Viber number is required.";
        }
        return null;
      }
      case "planning":
        if (!a.projectType) return "Select a project type.";
        if (scopes.length && !a.subCategory) return "Select a sub-category.";
        if (!a.projectStatus) return "Select a project status.";
        return null;
      case "property":
        if (!a.hasProperty) return "Tell us if you already have a property.";
        if (a.hasProperty === "Yes" && !a.propertyLocation.trim()) {
          return "Property location is required when you already have a property.";
        }
        return null;
      case "budget":
        if (!a.estimatedBudget) return "Select an estimated budget.";
        return null;
      case "inspiration":
        return null;
      case "details":
        if (a.projectNotes.length > FORM_LIMITS.notes) {
          return `Notes must be under ${FORM_LIMITS.notes} characters.`;
        }
        return null;
      case "review":
        if (!a.consent) {
          return "Please agree to the Privacy Policy and Terms before submitting.";
        }
        return null;
      default:
        return null;
    }
  }

  function goNext() {
    const err = validateStep(step);
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg(null);
    setStep((s) => Math.min(s + 1, STEP_KEYS.length - 1));
  }

  function goBack() {
    setErrorMsg(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit() {
    const err = validateStep(STEP_KEYS.length - 1);
    if (err) {
      setErrorMsg(err);
      return;
    }
    if (!isBrowserOnline()) {
      setStatus("error");
      setErrorMsg(submitErrorMessage());
      return;
    }
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const payload = {
        ...answers,
        consentAccepted: true,
        submittedAt: new Date().toISOString(),
      };
      const { error } = await supabase.from("inquiries").insert({
        name: answers.fullName.trim(),
        email: answers.email.trim(),
        phone: answers.mobile.trim() || null,
        service: inquireServiceLabel(answers),
        location: answers.propertyLocation.trim() || null,
        budget: answers.estimatedBudget || null,
        preferred_date: null,
        message: compileInquireMessage(answers),
        payload,
      });
      if (error) {
        const retry = await supabase.from("inquiries").insert({
          name: answers.fullName.trim(),
          email: answers.email.trim(),
          phone: answers.mobile.trim() || null,
          service: inquireServiceLabel(answers),
          location: answers.propertyLocation.trim() || null,
          budget: answers.estimatedBudget || null,
          preferred_date: null,
          message: compileInquireMessage({
            ...answers,
            projectNotes:
              `${answers.projectNotes}\n\n[Consent: Privacy Policy & Terms accepted]`.trim(),
          }),
        });
        if (retry.error) {
          setStatus("error");
          setErrorMsg(submitErrorMessage(retry.error));
          return;
        }
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setErrorMsg(submitErrorMessage(e as { message?: string }));
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border-l-2 border-gold bg-beige px-6 py-10 sm:px-10 sm:py-14"
      >
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
          Inquiry sent
        </p>
        <h2 className="mt-4 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
          {content.successTitle}
        </h2>
        <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-charcoal/75">
          {content.successBody}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-terracotta"
          >
            Back to home
          </Link>
          <button
            type="button"
            onClick={() => {
              setAnswers(emptyInquireAnswers());
              setStep(0);
              setStatus("idle");
            }}
            className="inline-flex min-h-11 cursor-pointer items-center border border-chestnut px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-chestnut"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  const stepKey = STEP_KEYS[step];
  const stepTitle = content.steps[stepKey];

  return (
    <div className="bg-warm-white">
      {/* Progress track */}
      <div
        className="h-1 w-full overflow-hidden bg-warm-gray/50"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEP_KEYS.length}
        aria-valuenow={step + 1}
        aria-label={`Step ${step + 1} of ${STEP_KEYS.length}`}
      >
        <div
          className="h-full bg-chestnut transition-[width] duration-300 ease-out"
          style={{ width: `${((step + 1) / STEP_KEYS.length) * 100}%` }}
        />
      </div>

      <ol className="mt-6 flex flex-wrap gap-2 border-b border-warm-gray/70 px-1 pb-6" aria-label="Progress">
        {STEP_KEYS.map((key, i) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => {
                if (i <= step) {
                  setErrorMsg(null);
                  setStep(i);
                }
              }}
              disabled={i > step}
              className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 px-2 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.14em] transition-colors disabled:cursor-default ${
                i === step
                  ? "text-chestnut"
                  : i < step
                    ? "text-charcoal/55 hover:text-chestnut"
                    : "text-charcoal/25"
              }`}
            >
              <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="hidden sm:inline">{content.steps[key]}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
          Step {String(step + 1).padStart(2, "0")} / {String(STEP_KEYS.length).padStart(2, "0")}
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
          {stepTitle}
        </h2>
      </div>

      <div className="mt-8 min-h-[18rem]">
        {stepKey === "aboutYou" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={content.fields.fullName} required>
              <input
                className={inputClass}
                value={answers.fullName}
                onChange={(e) => patch({ fullName: e.target.value })}
                autoComplete="name"
              />
            </Field>
            <Field label={content.fields.email} required>
              <input
                type="email"
                className={inputClass}
                value={answers.email}
                onChange={(e) => patch({ email: e.target.value })}
                autoComplete="email"
              />
            </Field>
            <Field label={content.fields.mobile}>
              <input
                type="tel"
                className={inputClass}
                value={answers.mobile}
                onChange={(e) => patch({ mobile: e.target.value })}
                autoComplete="tel"
              />
            </Field>
            <Field label={content.fields.contactMethod} required>
              <ChoiceGroup
                options={content.contactMethods}
                value={answers.contactMethod}
                onChange={(contactMethod) =>
                  patch({ contactMethod, contactDetails: "" })
                }
              />
            </Field>
            {answers.contactMethod === "Messenger" ? (
              <Field label={content.fields.messengerLink} required className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={answers.contactDetails}
                  onChange={(e) => patch({ contactDetails: e.target.value })}
                  placeholder="https://m.me/..."
                />
              </Field>
            ) : null}
            {answers.contactMethod === "Viber" ? (
              <Field label={content.fields.viberNumber} required className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={answers.contactDetails}
                  onChange={(e) => patch({ contactDetails: e.target.value })}
                  placeholder="+63..."
                />
              </Field>
            ) : null}
          </div>
        ) : null}

        {stepKey === "planning" ? (
          <div className="grid gap-6">
            <Field label={content.fields.projectType} required>
              <ChoiceGroup
                options={services.map((s) => s.title)}
                value={answers.projectType}
                onChange={(projectType) =>
                  patch({ projectType, subCategory: "" })
                }
              />
            </Field>
            {scopes.length > 0 ? (
              <Field label={content.fields.subCategory} required>
                <ChoiceGroup
                  options={scopes}
                  value={answers.subCategory}
                  onChange={(subCategory) => patch({ subCategory })}
                />
              </Field>
            ) : null}
            <Field label={content.fields.projectStatus} required>
              <ChoiceGroup
                options={content.projectStatuses}
                value={answers.projectStatus}
                onChange={(projectStatus) => patch({ projectStatus })}
              />
            </Field>
          </div>
        ) : null}

        {stepKey === "property" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={content.fields.hasProperty} required className="sm:col-span-2">
              <ChoiceGroup
                options={content.propertyOptions}
                value={answers.hasProperty}
                onChange={(hasProperty) => patch({ hasProperty })}
              />
            </Field>
            {answers.hasProperty === "Yes" ? (
              <>
                <Field label={content.fields.propertyLocation} required className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={answers.propertyLocation}
                    onChange={(e) => patch({ propertyLocation: e.target.value })}
                  />
                </Field>
                <Field label={`${content.fields.lotArea} (optional)`}>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={answers.lotArea}
                    onChange={(e) => patch({ lotArea: e.target.value })}
                  />
                </Field>
                <Field label={`${content.fields.floorArea} (optional)`}>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={answers.floorArea}
                    onChange={(e) => patch({ floorArea: e.target.value })}
                  />
                </Field>
                <Field label={content.fields.propertyPhotos} className="sm:col-span-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="block w-full font-heading text-sm text-charcoal"
                    onChange={(e) => {
                      startTransition(async () => {
                        const result = await uploadFiles(e.target.files);
                        if (result.error) {
                          setErrorMsg(result.error);
                          return;
                        }
                        if (result.urls.length) {
                          patch({
                            propertyPhotos: [...answers.propertyPhotos, ...result.urls],
                          });
                        }
                      });
                    }}
                  />
                  <ThumbList urls={answers.propertyPhotos} />
                </Field>
              </>
            ) : null}
          </div>
        ) : null}

        {stepKey === "budget" ? (
          <Field label={content.fields.estimatedBudget} required>
            <ChoiceGroup
              options={content.budgetOptions}
              value={answers.estimatedBudget}
              onChange={(estimatedBudget) => patch({ estimatedBudget })}
            />
            {answers.estimatedBudget === "I'd like a cost estimate first" ? (
              <p className="mt-4 font-body text-sm text-charcoal/70">
                You can also open the{" "}
                <Link href="/estimate" className="text-chestnut underline-offset-2 hover:underline">
                  cost calculator
                </Link>{" "}
                anytime.
              </p>
            ) : null}
          </Field>
        ) : null}

        {stepKey === "inspiration" ? (
          <div className="grid gap-5">
            <Field label={content.fields.inspirationUploads}>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                className="block w-full font-heading text-sm text-charcoal"
                onChange={(e) => {
                  startTransition(async () => {
                    const result = await uploadFiles(e.target.files);
                    if (result.error) {
                      setErrorMsg(result.error);
                      return;
                    }
                    if (result.urls.length) {
                      patch({
                        inspirationUploads: [
                          ...answers.inspirationUploads,
                          ...result.urls,
                        ],
                      });
                    }
                  });
                }}
              />
              <ThumbList urls={answers.inspirationUploads} />
            </Field>
            <Field label={content.fields.moodboardLinks}>
              <textarea
                rows={3}
                className={`${inputClass} resize-y font-body`}
                value={answers.moodboardLinks}
                onChange={(e) => patch({ moodboardLinks: e.target.value })}
                placeholder="Paste one link per line"
              />
            </Field>
          </div>
        ) : null}

        {stepKey === "details" ? (
          <Field label={content.fields.projectNotes}>
            <textarea
              rows={6}
              className={`${inputClass} resize-y font-body`}
              value={answers.projectNotes}
              onChange={(e) => patch({ projectNotes: e.target.value })}
              placeholder={content.fields.projectNotesPlaceholder}
            />
          </Field>
        ) : null}

        {stepKey === "review" ? (
          <div className="space-y-6">
            <ReviewBlock title={content.steps.aboutYou}>
              <p>{answers.fullName}</p>
              <p>{answers.email}</p>
              {answers.mobile ? <p>{answers.mobile}</p> : null}
              <p>
                {answers.contactMethod}
                {answers.contactDetails ? ` — ${answers.contactDetails}` : ""}
              </p>
            </ReviewBlock>
            <ReviewBlock title={content.steps.planning}>
              <p>{answers.projectType}</p>
              {answers.subCategory ? <p>{answers.subCategory}</p> : null}
              <p>{answers.projectStatus}</p>
            </ReviewBlock>
            <ReviewBlock title={content.steps.property}>
              <p>{answers.hasProperty}</p>
              {answers.hasProperty === "Yes" ? (
                <>
                  <p>{answers.propertyLocation}</p>
                  {answers.lotArea ? <p>Lot: {answers.lotArea} sqm</p> : null}
                  {answers.floorArea ? <p>Floor: {answers.floorArea} sqm</p> : null}
                </>
              ) : null}
            </ReviewBlock>
            <ReviewBlock title={content.steps.budget}>
              <p>{answers.estimatedBudget}</p>
            </ReviewBlock>
            <ReviewBlock title={content.steps.details}>
              <p className="whitespace-pre-wrap">{answers.projectNotes}</p>
            </ReviewBlock>
            <FormConsentLabel
              id="inquire-consent"
              checked={answers.consent}
              onChange={(consent) => patch({ consent })}
            />
          </div>
        ) : null}
      </div>

      {!online ? (
        <p
          role="status"
          className="mt-6 border-l-2 border-terracotta bg-beige px-4 py-3 text-sm text-charcoal"
        >
          You&apos;re offline. Progress is saved on this device — reconnect to upload files or
          submit.
        </p>
      ) : null}

      {errorMsg ? (
        <p role="alert" className="mt-6 border-l-2 border-terracotta bg-beige px-4 py-3 text-sm text-charcoal">
          {errorMsg}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-warm-gray/70 pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0 || status === "submitting"}
          className="inline-flex min-h-11 cursor-pointer items-center border border-warm-gray px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        {step < STEP_KEYS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={pending}
            className="inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-terracotta disabled:opacity-60"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void onSubmit()}
            disabled={status === "submitting" || pending || !online}
            className="inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-terracotta disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "submitting"
              ? "Sending…"
              : !online
                ? "Offline — reconnect to send"
                : content.submitLabel}
          </button>
        )}
      </div>

      {/* Keep title styles referenced so CMS typography edits stay meaningful */}
      <span className="sr-only" style={textStyle(content.styles?.title)}>
        {content.title}
      </span>
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();
  const kids = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const type = child.type;
    if (type === "input" || type === "textarea") {
      return cloneElement(child as ReactElement<{ id?: string }>, { id });
    }
    return child;
  });
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
      >
        {label}
        {required ? " *" : ""}
      </label>
      {kids}
    </div>
  );
}

function ChoiceGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="group" className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt)}
            className={`inline-flex min-h-11 cursor-pointer items-center border px-3.5 py-2 font-heading text-xs font-semibold tracking-[0.04em] transition-colors ${
              selected
                ? "border-chestnut bg-chestnut text-warm-white"
                : "border-warm-gray bg-white text-charcoal hover:border-chestnut"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-warm-gray/60 pt-4">
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">
        {title}
      </p>
      <div className="mt-2 space-y-1 font-body text-sm leading-relaxed text-charcoal/80">
        {children}
      </div>
    </div>
  );
}

function ThumbList({ urls }: { urls: string[] }) {
  if (!urls.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {urls.map((url) => (
        <li key={url} className="relative h-16 w-16 overflow-hidden bg-beige">
          {url.match(/\.(png|jpe?g|webp|gif)/i) ? (
            <Image src={url} alt="" fill className="object-cover" sizes="64px" unoptimized />
          ) : (
            <a href={url} target="_blank" rel="noreferrer" className="flex h-full items-center justify-center p-1 text-[0.6rem] text-chestnut">
              File
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
