import AboutSticky from "./AboutSticky";
import type { SiteContent } from "@/lib/cms";

/** About — sticky intro (photo + bio) while credentials scroll. */
export default function About({ data }: { data: SiteContent["about"] }) {
  return <AboutSticky data={data} />;
}
