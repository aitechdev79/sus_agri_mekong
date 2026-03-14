export type SearchEngine = "google_news" | "google" | "bing_news";

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
    engine: SearchEngine;
    lang: string;
    maxResults: number;
    timeframeDays: number;
}

export interface NewsSearchResponse {
    fresh: NewsArticle[];
    old: NewsArticle[];
}