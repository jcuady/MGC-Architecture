import InsightsImmersive from "./InsightsImmersive";
import LatestArticles from "./LatestArticles";
import type { SiteContent } from "@/lib/cms";

/**
 * Insights block — immersive Before You Build scrub scene + horizontal articles.
 */
export default function Insights({ data }: { data: SiteContent["insights"] }) {
  return (
    <>
      <InsightsImmersive data={data} />
      <LatestArticles data={data.articles} />
    </>
  );
}
