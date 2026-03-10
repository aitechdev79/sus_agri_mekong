import { NextRequest, NextResponse } from "next/server";
import { requireModerator } from "@/lib/auth-middleware";
import { summarizeArticles, summarizePdfBuffer, summarizePdfFromUrl, summarizeText, summarizeUrlContent } from "@/lib/openai-admin";
import { SummarizeRequest, SummarizeResponse } from "@/types/ai-news";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const moderator = await requireModerator(request);
    if (!moderator) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const outputLanguage = form.get("outputLanguage") === "en" ? "en" : "vi";
      const customPrompt = String(form.get("customPrompt") || "").trim();
      const file = form.get("pdfFile");

      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Missing PDF file upload." }, { status: 400 });
      }

      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const summary = await summarizePdfBuffer(buffer, customPrompt, outputLanguage, file.name || "upload.pdf");
      const result: SummarizeResponse = { summary, sourceType: "pdf" };
      return NextResponse.json(result, { status: 200 });
    }

    const body = (await request.json()) as Partial<SummarizeRequest>;
    const outputLanguage = body.outputLanguage === "en" ? "en" : "vi";
    const customPrompt = body.customPrompt?.trim() || "";

    if (body.pdfUrl?.trim()) {
      const summary = await summarizePdfFromUrl(body.pdfUrl, customPrompt, outputLanguage);
      const result: SummarizeResponse = { summary, sourceType: "pdf" };
      return NextResponse.json(result, { status: 200 });
    }

    if (body.sourceUrl?.trim()) {
      const summary = await summarizeUrlContent(body.sourceUrl, customPrompt, outputLanguage);
      const result: SummarizeResponse = { summary, sourceType: "url" };
      return NextResponse.json(result, { status: 200 });
    }

    if (body.rawText?.trim()) {
      const summary = await summarizeText(body.rawText, customPrompt, outputLanguage);
      const result: SummarizeResponse = { summary, sourceType: "text" };
      return NextResponse.json(result, { status: 200 });
    }

    if (Array.isArray(body.articles) && body.articles.length > 0) {
      const summary = await summarizeArticles(body.articles, customPrompt, outputLanguage);
      const result: SummarizeResponse = { summary, sourceType: "articles" };
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { error: "Please provide one source: articles, rawText, sourceUrl, pdfUrl, or pdf upload." },
      { status: 400 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
