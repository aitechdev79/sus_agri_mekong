import { NewsArticle } from "@/types/ai-news";

const OPENAI_API_BASE = "https://api.openai.com/v1";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const MAX_PDF_SIZE_BYTES = 8 * 1024 * 1024;

interface OpenAITextResponse {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
}

interface SearchQueryDraft {
  query: string;
  hints?: string[];
}

function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return key;
}

function extractOutputText(payload: OpenAITextResponse): string {
  if (payload.output_text && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const chunks: string[] = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

async function callResponsesApi(body: Record<string, unknown>): Promise<OpenAITextResponse> {
  const response = await fetch(`${OPENAI_API_BASE}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as OpenAITextResponse;
}

export async function draftNewsQuery(
  topic: string,
  geoScope: string,
  lang: "vi" | "en",
): Promise<SearchQueryDraft> {
  const langInstruction =
    lang === "vi"
      ? "Write query in Vietnamese with critical keywords kept in English when needed."
      : "Write query in English.";

  const payload = await callResponsesApi({
    model: DEFAULT_MODEL,
    temperature: 0.2,
    text: { format: { type: "json_object" } },
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You optimize search queries for breaking/news search. Return strict JSON with keys: query (string), hints (string[] up to 5).",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Topic: ${topic}\nGeo scope: ${geoScope}\n${langInstruction}`,
          },
        ],
      },
    ],
  });

  const raw = extractOutputText(payload);
  if (!raw) {
    throw new Error("OpenAI returned empty query draft");
  }

  const parsed = JSON.parse(raw) as SearchQueryDraft;
  if (!parsed.query || typeof parsed.query !== "string") {
    throw new Error("OpenAI query draft is invalid");
  }

  return parsed;
}

function buildArticlesContext(articles: NewsArticle[]): string {
  return articles
    .map((item, index) => {
      const date = item.normalizedDate || item.publishedDate || "Unknown";
      return [
        `Article ${index + 1}:`,
        `Title: ${item.title}`,
        `Source: ${item.source}`,
        `Date: ${date}`,
        `URL: ${item.url}`,
        `Snippet: ${item.content}`,
      ].join("\n");
    })
    .join("\n\n");
}

export async function summarizeArticles(
  articles: NewsArticle[],
  customPrompt: string,
  outputLanguage: "vi" | "en",
): Promise<string> {
  const languageLine = outputLanguage === "vi" ? "Output language: Vietnamese." : "Output language: English.";
  const prompt = customPrompt.trim() || "Summarize key trends, risks, opportunities, and action points.";

  const payload = await callResponsesApi({
    model: DEFAULT_MODEL,
    temperature: 0.3,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You summarize news for policy/program teams. Be factual and concise. If confidence is low, state uncertainty.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `${languageLine}\nCustom instruction: ${prompt}\n\nNews set:\n${buildArticlesContext(articles)}`,
          },
        ],
      },
    ],
  });

  const output = extractOutputText(payload);
  if (!output) {
    throw new Error("OpenAI returned empty summary");
  }

  return output;
}

export async function summarizeText(
  text: string,
  customPrompt: string,
  outputLanguage: "vi" | "en",
): Promise<string> {
  const languageLine = outputLanguage === "vi" ? "Output language: Vietnamese." : "Output language: English.";
  const prompt = customPrompt.trim() || "Summarize the text with key takeaways and action points.";

  const payload = await callResponsesApi({
    model: DEFAULT_MODEL,
    temperature: 0.3,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "You summarize user-provided documents with clear sections and practical implications.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `${languageLine}\nCustom instruction: ${prompt}\n\nText:\n${text}`,
          },
        ],
      },
    ],
  });

  const output = extractOutputText(payload);
  if (!output) {
    throw new Error("OpenAI returned empty summary");
  }

  return output;
}

export async function summarizePdfFromUrl(
  pdfUrl: string,
  customPrompt: string,
  outputLanguage: "vi" | "en",
): Promise<string> {
  const url = pdfUrl.trim();
  if (!url) {
    throw new Error("PDF URL is required");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid PDF URL");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only http/https PDF URLs are supported");
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
    throw new Error("Localhost URLs are not allowed");
  }

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not fetch PDF: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("pdf") && !url.toLowerCase().endsWith(".pdf")) {
    throw new Error("The provided URL does not look like a PDF file");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_PDF_SIZE_BYTES) {
    throw new Error("PDF is too large. Please use a file under 8MB.");
  }

  const base64 = buffer.toString("base64");
  const languageLine = outputLanguage === "vi" ? "Output language: Vietnamese." : "Output language: English.";
  const prompt = customPrompt.trim() || "Summarize this PDF into key points and recommended actions.";

  const payload = await callResponsesApi({
    model: DEFAULT_MODEL,
    temperature: 0.3,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_file",
            filename: "document.pdf",
            file_data: `data:application/pdf;base64,${base64}`,
          },
          {
            type: "input_text",
            text: `${languageLine}\n${prompt}`,
          },
        ],
      },
    ],
  });

  const output = extractOutputText(payload);
  if (!output) {
    throw new Error("OpenAI returned empty PDF summary");
  }

  return output;
}
