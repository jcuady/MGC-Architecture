import type { CSSProperties } from "react";
import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  lede?: string;
  tone?: "light" | "dark";
  titleStyle?: CSSProperties;
  ledeStyle?: CSSProperties;
};

export default function SectionHeader({
  eyebrow,
  title,
  lede,
  tone = "light",
  titleStyle,
  ledeStyle,
}: Props) {
  const eyebrowColor = tone === "dark" ? "text-gold" : "text-terracotta";
  const titleColor = tone === "dark" ? "text-warm-white" : "text-charcoal";
  const ledeColor = tone === "dark" ? "text-warm-gray" : "text-charcoal/75";

  return (
    <Reveal className="max-w-3xl">
      <p
        className={`font-heading text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem] ${titleColor}`}
        style={titleStyle}
      >
        {title}
      </h2>
      {lede && (
        <p className={`mt-5 text-lg leading-relaxed ${ledeColor}`} style={ledeStyle}>
          {lede}
        </p>
      )}
    </Reveal>
  );
}
