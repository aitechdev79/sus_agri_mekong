export type NewsSearchEngine = "google_news" | "google" | "bing_news";

export interface NewsArticle {
  title: string;
  url: string;
  content: string;
  publishedDate: string;
  source: string;
  thumbnail?: string;
  normalizedDate?: string;
}

export interface NewsSearchRequest {
  topic: string;
  geoScope: string;
  engine: NewsSearchEngine;
  lang: "vi" | "en";
  maxResults: number;
  timeframeDays: number;
  useAiQuery: boolean;
}

export interface NewsSearchResponse {
  query: string;
  fresh: NewsArticle[];
  old: NewsArticle[];
  queryHints?: string[];
}

export interface SummarizeRequest {
  customPrompt: string;
  outputLanguage?: "vi" | "en";
  articles?: NewsArticle[];
  rawText?: string;
  pdfUrl?: string;
  sourceUrl?: string;
}

export interface SummarizeResponse {
  summary: string;
  sourceType: "articles" | "text" | "pdf" | "url";
}
