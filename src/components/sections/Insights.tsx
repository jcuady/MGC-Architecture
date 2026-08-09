import LatestArticles, { type LatestArticlesData } from "./LatestArticles";
import type { SiteContent } from "@/lib/cms";

/**
 * Blog / insights strip — Latest Articles only.
 * Before You Build immersive scrub removed (perf + pin duplication).
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

  return <LatestArticles data={articleData} />;
}
