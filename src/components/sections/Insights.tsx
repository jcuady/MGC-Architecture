import InsightsImmersive from "./InsightsImmersive";
import LatestArticles, { type LatestArticlesData } from "./LatestArticles";
import type { SiteContent } from "@/lib/cms";

/**
 * Insights block - immersive Before You Build scrub scene + horizontal articles.
 */
export default function Insights({
  data,
  articles,
}: {
  data: SiteContent["insights"];
  articles?: LatestArticlesData;
}) {
  const articleData: LatestArticlesData =
    articles ?? {
      eyebrow: data.articles.eyebrow,
      title: data.articles.title,
      seeAllLabel: data.articles.seeAllLabel,
      seeAllHref: data.articles.seeAllHref,
      items: data.articles.items.map((item) => ({
        title: item.title,
        readMins: item.readMins,
        image: item.image,
        imageAlt: item.imageAlt,
        href: item.href,
      })),
    };

  return (
    <>
      <InsightsImmersive data={data} />
      <LatestArticles data={articleData} />
    </>
  );
}
