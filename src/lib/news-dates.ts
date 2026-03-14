import { NewsArticle } from "@/types/ai-news";

const YEAR_IN_URL_REGEX = /(20\d{2})/;

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function normalizeDate(dateStr?: string, url?: string): string {
  if (!dateStr) {
    return "Unknown";
  }

  const lowered = dateStr.toLowerCase();
  const agoMatch = lowered.match(/(\d+)\s+(hour|hours|day|days)\s+ago/);

  if (agoMatch) {
    const value = Number.parseInt(agoMatch[1], 10);
    const unit = agoMatch[2];
    const now = new Date();

    if (unit.startsWith("hour")) {
      now.setHours(now.getHours() - value);
    } else {
      now.setDate(now.getDate() - value);
    }

    return toIsoDate(now);
  }

  const parsedDate = new Date(dateStr);

  if (!Number.isNaN(parsedDate.getTime())) {
    if (parsedDate.getFullYear() < 2024 && url?.includes("2025")) {
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");
      return `2025-${month}-${day}`;
    }

    return toIsoDate(parsedDate);
  }

  if (url) {
    const yearMatch = url.match(YEAR_IN_URL_REGEX);
    if (yearMatch) {
      return `${yearMatch[1]}-01-01`;
    }
  }

  return "Unknown";
}

export interface NewsSearchBuckets {
  fresh: NewsArticle[];
  old: NewsArticle[];
}

export function filterByDate(articles: NewsArticle[], days: number): NewsSearchBuckets {
  if (days === 0) {
    return {
      fresh: articles,
      old: [],
    };
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const fresh: NewsArticle[] = [];
  const old: NewsArticle[] = [];

  for (const article of articles) {
    const normalizedDate = normalizeDate(article.publishedDate, article.url);
    const withNormalizedDate: NewsArticle = {
      ...article,
      normalizedDate,
    };

    if (normalizedDate === "Unknown") {
      old.push(withNormalizedDate);
      continue;
    }

    const parsed = new Date(normalizedDate);

    if (Number.isNaN(parsed.getTime())) {
      old.push(withNormalizedDate);
      continue;
    }

    if (parsed >= cutoff) {
      fresh.push(withNormalizedDate);
    } else {
      old.push(withNormalizedDate);
    }
  }

  return { fresh, old };
}
