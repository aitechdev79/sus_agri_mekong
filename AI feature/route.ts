import { NextRequest, NextResponse } from "next/server";
import { filterByDate } from "../../../../lib/dates";
import {
    NewsArticle,
    NewsSearchRequest,
    NewsSearchResponse,
    SearchEngine,
} from "../../../../types/news";

interface SerpApiResponse {
    news_results?: Array<Record<string, unknown>>;
    organic_results?: Array<Record<string, unknown>>;
}

function buildQuery(topic: string, geoScope: string): string {
    return `${topic} ${geoScope} news`;
}

function mapEngineResult(
    engine: SearchEngine,
    item: Record<string, unknown>,
): NewsArticle {
    const sourceField = item.source;
    const source =
        typeof sourceField === "string"
            ? sourceField
            : (sourceField as { name?: string } | undefined)?.name || "Unknown";

    return {
        title: String(item.title || "Untitled"),
        url: String(item.link || ""),
        content: String(item.snippet || ""),
        publishedDate:
            engine === "google"
                ? "Unknown"
                : String(item.date || "Unknown"),
        source: engine === "google" ? source || "Google Search" : source,
        thumbnail: String(item.thumbnail || item.image || "") || undefined,
    };
}

async function serpApiSearch(
    query: string,
    engine: SearchEngine,
    lang: string,
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

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = (await request.json()) as Partial<NewsSearchRequest>;

        const payload: NewsSearchRequest = {
            topic: body.topic || "sustainable agriculture",
            geoScope: body.geoScope || "Vietnam, ASEAN, and Global",
            engine: body.engine || "google_news",
            lang: body.lang || "vi",
            maxResults: body.maxResults || 10,
            timeframeDays: body.timeframeDays ?? 7,
        };

        const query = buildQuery(payload.topic, payload.geoScope);
        const articles = await serpApiSearch(query, payload.engine, payload.lang, payload.maxResults);
        const { fresh, old } = filterByDate(articles, payload.timeframeDays);

        const result: NewsSearchResponse = { fresh, old };
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}