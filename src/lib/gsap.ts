// Shared GSAP setup — import only from client components.
// ScrollToPlugin is registered lazily where needed (process page) to keep
// the homepage / common chunk smaller.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

export async function ensureScrollToPlugin() {
  if (typeof window === "undefined") return;
  const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
  gsap.registerPlugin(ScrollToPlugin);
  return ScrollToPlugin;
}
