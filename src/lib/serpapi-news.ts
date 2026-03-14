import { NewsArticle, NewsSearchEngine } from "@/types/ai-news";

interface SerpApiResponse {
  news_results?: Array<Record<string, unknown>>;
  organic_results?: Array<Record<string, unknown>>;
}

export function buildNewsQuery(topic: string, geoScope: string): string {
  return `${topic} ${geoScope} news`;
}

function mapEngineResult(engine: NewsSearchEngine, item: Record<string, unknown>): NewsArticle {
  const sourceField = item.source;
  const source =
    typeof sourceField === "string"
      ? sourceField
      : (sourceField as { name?: string } | undefined)?.name || "Unknown";

  return {
    title: String(item.title || "Untitled"),
    url: String(item.link || ""),
    content: String(item.snippet || ""),
    publishedDate: engine === "google" ? "Unknown" : String(item.date || "Unknown"),
    source: engine === "google" ? source || "Google Search" : source,
    thumbnail: String(item.thumbnail || item.image || "") || undefined,
  };
}

export async function serpApiSearch(
  query: string,
  engine: NewsSearchEngine,
  lang: "vi" | "en",
  maxResults: number,
): Promise<NewsArticle[]> {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    throw new Error("SERPAPI_KEY is not configured");
  }

  const params = new URLSearchParams({
    engine,
    q: query,
    api_key: apiKey,
    num: String(maxResults),
  });

  if (engine === "google" || engine === "google_news") {
    params.set("hl", lang);
  }

  if (engine === "bing_news") {
    params.set("cc", lang === "vi" ? "vn" : "us");
  }

  const response = await fetch(`https://serpapi.com/search?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`SerpAPI request failed: ${response.status}`);
  }

  const data = (await response.json()) as SerpApiResponse;

  if (engine === "google" && data.organic_results) {
    return data.organic_results.slice(0, maxResults).map((item) => mapEngineResult(engine, item));
  }

  return (data.news_results || []).slice(0, maxResults).map((item) => mapEngineResult(engine, item));
}
