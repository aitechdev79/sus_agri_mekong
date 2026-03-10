"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Download, FileText, Loader2, Newspaper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsArticle, NewsSearchEngine, NewsSearchResponse } from "@/types/ai-news";

interface SearchFormState {
  topic: string;
  geoScope: string;
  engine: NewsSearchEngine;
  lang: "vi" | "en";
  maxResults: number;
  timeframeDays: number;
  useAiQuery: boolean;
}

type SummarizeMode = "news" | "pdf-url" | "pdf-upload" | "url" | "text";

const initialSearchForm: SearchFormState = {
  topic: "nÃ´ng nghiá»‡p bá»n vá»¯ng",
  geoScope: "Viá»‡t Nam, ASEAN",
  engine: "google_news",
  lang: "vi",
  maxResults: 10,
  timeframeDays: 7,
  useAiQuery: true,
};

export function AiNewsPanel() {
  const [form, setForm] = useState<SearchFormState>(initialSearchForm);
  const [searching, setSearching] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [searchResult, setSearchResult] = useState<NewsSearchResponse | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [fallbackTargetCount, setFallbackTargetCount] = useState(10);

  const [customPrompt, setCustomPrompt] = useState(
    "CÃ¢u tráº£ lá»i gá»“m 2 pháº§n. [1] Ná»™i dung ngáº¯n: Tráº£ lá»i Ä‘Ãºng 1 cÃ¢u duy nháº¥t, tÃ³m táº¯t cá»‘t lÃµi cá»§a tÃ i liá»‡u. [2] Ná»™i dung dÃ i: TÃ³m táº¯t chi tiáº¿t khoáº£ng 1 trang A4, máº¡ch láº¡c, trung tÃ­nh, cÃ³ cáº¥u trÃºc vá»›i cÃ¡c Ä‘oáº¡n rÃµ rÃ ng.",
  );
  const [pdfUrl, setPdfUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [summary, setSummary] = useState("");
  const [sourceMode, setSourceMode] = useState<SummarizeMode>("news");
  const [outputLanguage, setOutputLanguage] = useState<"vi" | "en">("vi");

  const displayArticles = useMemo(() => {
    if (!searchResult) return [];
    if (!fallbackEnabled || searchResult.fresh.length >= fallbackTargetCount) {
      return searchResult.fresh;
    }

    const needed = Math.max(0, fallbackTargetCount - searchResult.fresh.length);
    return [...searchResult.fresh, ...searchResult.old.slice(0, needed)];
  }, [searchResult, fallbackEnabled, fallbackTargetCount]);

  const selectedArticles = useMemo(() => {
    if (!displayArticles.length || !selectedUrl) {
      return [];
    }
    const selected = displayArticles.find((article) => article.url === selectedUrl);
    return selected ? [selected] : [];
  }, [displayArticles, selectedUrl]);

  const onNumberInput =
    (field: "maxResults" | "timeframeDays") => (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const onSearchNews = async () => {
    try {
      setSearching(true);
      setSearchError("");

      const response = await fetch("/api/admin/ai/news-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      const result = data as NewsSearchResponse;
      setSearchResult(result);
      setSelectedUrl(null);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const onSummarize = async () => {
    try {
      setSummarizing(true);
      setSummaryError("");
      setSummary("");

      let response: Response;

      if (sourceMode === "pdf-upload") {
        if (!pdfFile) {
          throw new Error("Please choose a PDF file first.");
        }

        const formData = new FormData();
        formData.append("customPrompt", customPrompt);
        formData.append("outputLanguage", outputLanguage);
        formData.append("pdfFile", pdfFile);

        response = await fetch("/api/admin/ai/summarize", {
          method: "POST",
          body: formData,
        });
      } else {
        const body: Record<string, unknown> = {
          customPrompt,
          outputLanguage,
        };

        if (sourceMode === "news") {
          body.articles = selectedArticles;
        } else if (sourceMode === "pdf-url") {
          body.pdfUrl = pdfUrl;
        } else if (sourceMode === "url") {
          body.sourceUrl = sourceUrl;
        } else {
          body.rawText = rawText;
        }

        response = await fetch("/api/admin/ai/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Summarization failed");
      }

      setSummary(data.summary || "");
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : "Summarization failed");
    } finally {
      setSummarizing(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const temp = document.createElement("textarea");
      temp.value = url;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.focus();
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
  };

  const downloadCsv = () => {
    const rows = selectedArticles.length > 0 ? selectedArticles : displayArticles;
    if (!rows.length) return;

    const escapeCell = (value: string): string => `"${value.replace(/"/g, '""')}"`;
    const headers = ["title", "source", "publishedDate", "normalizedDate", "url", "content"];
    const body = rows.map((item) =>
      [
        item.title,
        item.source,
        item.publishedDate,
        item.normalizedDate || "",
        item.url,
        item.content,
      ]
        .map((cell) => escapeCell(String(cell || "")))
        .join(","),
    );

    const csv = [headers.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ai-news-results.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const canSummarizeNews = sourceMode === "news" && selectedArticles.length > 0;
  const canSummarizePdfUrl = sourceMode === "pdf-url" && pdfUrl.trim().length > 0;
  const canSummarizePdfUpload = sourceMode === "pdf-upload" && !!pdfFile;
  const canSummarizeUrl = sourceMode === "url" && sourceUrl.trim().length > 0;
  const canSummarizeText = sourceMode === "text" && rawText.trim().length > 0;
  const canSummarize =
    canSummarizeNews || canSummarizePdfUrl || canSummarizePdfUpload || canSummarizeUrl || canSummarizeText;

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Content Finder</h2>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          TÃ¬m tin theo chá»§ Ä‘á», Ä‘á»‹a lÃ½ vÃ  thá»i gian vá»›i SerpAPI. CÃ³ thá»ƒ dÃ¹ng OpenAI Ä‘á»ƒ tá»‘i Æ°u truy váº¥n tÃ¬m kiáº¿m.
        </p>

        <div className="grid gap-3">
          <input
            value={form.topic}
            onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Chá»§ Ä‘á»"
          />
          <input
            value={form.geoScope}
            onChange={(event) => setForm((prev) => ({ ...prev, geoScope: event.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Pháº¡m vi Ä‘á»‹a lÃ½"
          />

          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={form.engine}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, engine: event.target.value as NewsSearchEngine }))
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="google_news">Google News</option>
              <option value="google">Google Search</option>
              <option value="bing_news">Bing News</option>
            </select>
            <select
              value={form.lang}
              onChange={(event) => setForm((prev) => ({ ...prev, lang: event.target.value as "vi" | "en" }))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="vi">Tiáº¿ng Viá»‡t</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="number"
              min={1}
              max={20}
              value={form.maxResults}
              onChange={onNumberInput("maxResults")}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Sá»‘ káº¿t quáº£"
            />
            <input
              type="number"
              min={0}
              max={90}
              value={form.timeframeDays}
              onChange={onNumberInput("timeframeDays")}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Sá»‘ ngÃ y"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.useAiQuery}
              onChange={(event) => setForm((prev) => ({ ...prev, useAiQuery: event.target.checked }))}
            />
            DÃ¹ng OpenAI Ä‘á»ƒ tá»‘i Æ°u truy váº¥n
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={fallbackEnabled}
              onChange={(event) => setFallbackEnabled(event.target.checked)}
            />
            Fallback: bá»• sung bÃ i cÅ© náº¿u bÃ i má»›i khÃ´ng Ä‘á»§
          </label>

          {fallbackEnabled && (
            <input
              type="number"
              min={1}
              max={20}
              value={fallbackTargetCount}
              onChange={(event) => setFallbackTargetCount(Number(event.target.value) || 1)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Tá»•ng sá»‘ bÃ i mong muá»‘n"
            />
          )}

          <div className="flex gap-2">
            <Button onClick={onSearchNews} disabled={searching}>
              {searching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              TÃ¬m tin
            </Button>
            <Button type="button" variant="secondary" onClick={downloadCsv} disabled={!displayArticles.length}>
              <Download className="mr-2 h-4 w-4" />
              Xuáº¥t CSV
            </Button>
          </div>
          {searchError && <p className="text-sm text-red-600">{searchError}</p>}
        </div>

        {searchResult && (
          <div className="mt-6 space-y-3">
            <div className="rounded-md bg-gray-50 p-3 text-sm">
              <div>
                <strong>Query:</strong> {searchResult.query}
              </div>
              {searchResult.queryHints && searchResult.queryHints.length > 0 && (
                <div className="mt-1 text-gray-600">Hints: {searchResult.queryHints.join(", ")}</div>
              )}
              <div className="mt-2 text-gray-600">
                Fresh: {searchResult.fresh.length} | Old: {searchResult.old.length} | Displayed:{" "}
                {displayArticles.length}
              </div>
              <div className="mt-1 text-gray-600">Selected for summary: {selectedArticles.length}</div>
            </div>

            <div className="max-h-72 space-y-2 overflow-auto pr-1">
              {displayArticles.map((article: NewsArticle, index: number) => {
                const isOld = !searchResult.fresh.some((freshItem) => freshItem.url === article.url);
                return (
                  <div key={`${article.url}-${index}`} className="rounded-md border border-gray-200 p-3 text-sm">
                    <div className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="selected-article"
                        checked={selectedUrl === article.url}
                        onChange={() => setSelectedUrl(article.url)}
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-gray-900 hover:underline"
                        >
                          {article.title}
                        </a>
                        <div className="mt-1 text-xs text-gray-500">
                          {article.source} | {article.normalizedDate || article.publishedDate}
                          {isOld ? " | BÃ i cÅ© bá»• sung" : ""}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyUrl(article.url)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Content Summarizer</h2>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          TÃ³m táº¯t tá»« tin Ä‘Ã£ tÃ¬m, URL, PDF URL, PDF táº£i lÃªn hoáº·c vÄƒn báº£n thÃ´ vá»›i prompt tÃ¹y chá»‰nh.
        </p>

        <div className="grid gap-3">
          <select
            value={sourceMode}
            onChange={(event) => setSourceMode(event.target.value as SummarizeMode)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="news">Nguá»“n: Tin Ä‘Ã£ chá»n</option>
            <option value="url">Nguá»“n: URL trang web</option>
            <option value="pdf-url">Nguá»“n: URL PDF</option>
            <option value="pdf-upload">Nguá»“n: Táº£i lÃªn PDF</option>
            <option value="text">Nguá»“n: VÄƒn báº£n thÃ´</option>
          </select>

          <select
            value={outputLanguage}
            onChange={(event) => setOutputLanguage(event.target.value as "vi" | "en")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="vi">Äáº§u ra: Tiáº¿ng Viá»‡t</option>
            <option value="en">Output: English</option>
          </select>

          {sourceMode === "url" && (
            <input
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://example.com/article"
            />
          )}

          {sourceMode === "pdf-url" && (
            <input
              value={pdfUrl}
              onChange={(event) => setPdfUrl(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://example.com/report.pdf"
            />
          )}

          {sourceMode === "pdf-upload" && (
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setPdfFile(event.target.files?.[0] || null)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          )}

          {sourceMode === "text" && (
            <textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              className="min-h-28 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="DÃ¡n ná»™i dung cáº§n tÃ³m táº¯t..."
            />
          )}

          <textarea
            value={customPrompt}
            onChange={(event) => setCustomPrompt(event.target.value)}
            className="min-h-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="CÃ¢u tráº£ lá»i gá»“m 2 pháº§n. [1] Ná»™i dung ngáº¯n: Tráº£ lá»i Ä‘Ãºng 1 cÃ¢u duy nháº¥t, tÃ³m táº¯t cá»‘t lÃµi cá»§a tÃ i liá»‡u. [2] Ná»™i dung dÃ i: TÃ³m táº¯t chi tiáº¿t khoáº£ng 1 trang A4, máº¡ch láº¡c, trung tÃ­nh, cÃ³ cáº¥u trÃºc vá»›i cÃ¡c Ä‘oáº¡n rÃµ rÃ ng."
          />

          <Button onClick={onSummarize} disabled={summarizing || !canSummarize}>
            {summarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            TÃ³m táº¯t
          </Button>
          {summaryError && <p className="text-sm text-red-600">{summaryError}</p>}
        </div>

        {summary && (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 text-sm font-semibold text-gray-900">Káº¿t quáº£ tÃ³m táº¯t</div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{summary}</pre>
          </div>
        )}
      </section>
    </div>
  );
}

