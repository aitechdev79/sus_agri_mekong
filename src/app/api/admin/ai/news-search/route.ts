import { NextRequest, NextResponse } from "next/server";
import { requireModerator } from "@/lib/auth-middleware";
import { filterByDate } from "@/lib/news-dates";
import { draftNewsQuery } from "@/lib/openai-admin";
import { buildNewsQuery, serpApiSearch } from "@/lib/serpapi-news";
import { NewsSearchRequest, NewsSearchResponse } from "@/types/ai-news";

function clampResults(value: number): number {
  if (Number.isNaN(value)) return 10;
  return Math.min(Math.max(value, 1), 20);
}

function clampDays(value: number): number {
  if (Number.isNaN(value)) return 7;
  return Math.min(Math.max(value, 0), 90);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const moderator = await requireModerator(request);
    if (!moderator) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = (await request.json()) as Partial<NewsSearchRequest>;

    const payload: NewsSearchRequest = {
      topic: body.topic?.trim() || "sustainable agriculture",
      geoScope: body.geoScope?.trim() || "Vietnam, ASEAN, and Global",
      engine: body.engine || "google_news",
      lang: body.lang || "vi",
      maxResults: clampResults(Number(body.maxResults ?? 10)),
      timeframeDays: clampDays(Number(body.timeframeDays ?? 7)),
      useAiQuery: body.useAiQuery ?? true,
    };

    let query = buildNewsQuery(payload.topic, payload.geoScope);
    let queryHints: string[] | undefined;

    if (payload.useAiQuery && process.env.OPENAI_API_KEY) {
      try {
        const drafted = await draftNewsQuery(payload.topic, payload.geoScope, payload.lang);
        if (drafted.query?.trim()) {
          query = drafted.query.trim();
          queryHints = drafted.hints?.filter(Boolean).slice(0, 5);
        }
      } catch (error) {
        console.error("AI query drafting failed. Falling back to default query:", error);
      }
    }

    const articles = await serpApiSearch(query, payload.engine, payload.lang, payload.maxResults);
    const { fresh, old } = filterByDate(articles, payload.timeframeDays);

    const result: NewsSearchResponse = { query, fresh, old, queryHints };
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
