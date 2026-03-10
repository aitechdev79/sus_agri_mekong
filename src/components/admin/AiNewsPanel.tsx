"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Loader2, Sparkles, Newspaper, FileText } from "lucide-react";
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

const initialSearchForm: SearchFormState = {
  topic: "nông nghiệp bền vững",
  geoScope: "Việt Nam, ASEAN",
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
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState(
    "Tóm tắt các xu hướng chính, rủi ro, cơ hội và đề xuất hành động cho đội dự án.",
  );
  const [pdfUrl, setPdfUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [summary, setSummary] = useState("");
  const [sourceMode, setSourceMode] = useState<"news" | "pdf" | "text">("news");
  const [outputLanguage, setOutputLanguage] = useState<"vi" | "en">("vi");

  const selectedArticles = useMemo(() => {
    const fresh = searchResult?.fresh || [];
    if (selectedUrls.length === 0) {
      return [];
    }
    const set = new Set(selectedUrls);
    return fresh.filter((article) => set.has(article.url));
  }, [searchResult, selectedUrls]);

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
      setSelectedUrls(result.fresh.map((article) => article.url).filter(Boolean));
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

      const body: Record<string, unknown> = {
        customPrompt,
        outputLanguage,
      };

      if (sourceMode === "news") {
        body.articles = selectedArticles;
      } else if (sourceMode === "pdf") {
        body.pdfUrl = pdfUrl;
      } else {
        body.rawText = rawText;
      }

      const response = await fetch("/api/admin/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

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

  const canSummarizeNews = sourceMode === "news" && selectedArticles.length > 0;
  const canSummarizePdf = sourceMode === "pdf" && pdfUrl.trim().length > 0;
  const canSummarizeText = sourceMode === "text" && rawText.trim().length > 0;
  const canSummarize = canSummarizeNews || canSummarizePdf || canSummarizeText;

  const onNumberInput =
    (field: "maxResults" | "timeframeDays") => (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const toggleArticle = (url: string) => {
    setSelectedUrls((prev) => (prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]));
  };

  const selectAllFresh = () => {
    setSelectedUrls((searchResult?.fresh || []).map((article) => article.url).filter(Boolean));
  };

  const clearSelection = () => {
    setSelectedUrls([]);
  };

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI News Finder</h2>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Tìm tin theo chủ đề, địa lý, thời gian với SerpAPI. Có thể dùng OpenAI để tối ưu câu truy vấn.
        </p>

        <div className="grid gap-3">
          <input
            value={form.topic}
            onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Chủ đề"
          />
          <input
            value={form.geoScope}
            onChange={(event) => setForm((prev) => ({ ...prev, geoScope: event.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Phạm vi địa lý"
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
              <option value="vi">Tiếng Việt</option>
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
              placeholder="Số lượng kết quả"
            />
            <input
              type="number"
              min={0}
              max={90}
              value={form.timeframeDays}
              onChange={onNumberInput("timeframeDays")}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Số ngày gần đây"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.useAiQuery}
              onChange={(event) => setForm((prev) => ({ ...prev, useAiQuery: event.target.checked }))}
            />
            Dùng OpenAI để tối ưu search query
          </label>

          <Button onClick={onSearchNews} disabled={searching}>
            {searching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Tìm tin
          </Button>
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
                Fresh: {searchResult.fresh.length} | Old: {searchResult.old.length}
              </div>
              <div className="mt-1 text-gray-600">Selected for summary: {selectedArticles.length}</div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllFresh}
                className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Chọn tất cả
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Bỏ chọn
              </button>
            </div>
            <div className="max-h-64 space-y-2 overflow-auto pr-1">
              {searchResult.fresh.map((article: NewsArticle, index: number) => (
                <div key={`${article.url}-${index}`} className="rounded-md border border-gray-200 p-3 text-sm">
                  <label className="flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={selectedUrls.includes(article.url)}
                      onChange={() => toggleArticle(article.url)}
                      className="mt-1"
                    />
                    <div className="min-w-0">
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
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Summarizer</h2>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Tóm tắt từ tin đã tìm được, văn bản tự nhập, hoặc PDF URL bằng prompt tùy chỉnh.
        </p>

        <div className="grid gap-3">
          <select
            value={sourceMode}
            onChange={(event) => setSourceMode(event.target.value as "news" | "pdf" | "text")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="news">Nguồn: Fresh news từ panel bên trái</option>
            <option value="pdf">Nguồn: PDF URL</option>
            <option value="text">Nguồn: Raw text</option>
          </select>

          <select
            value={outputLanguage}
            onChange={(event) => setOutputLanguage(event.target.value as "vi" | "en")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="vi">Đầu ra: Tiếng Việt</option>
            <option value="en">Output: English</option>
          </select>

          {sourceMode === "pdf" && (
            <input
              value={pdfUrl}
              onChange={(event) => setPdfUrl(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://example.com/report.pdf"
            />
          )}

          {sourceMode === "text" && (
            <textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              className="min-h-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Dán nội dung cần tóm tắt..."
            />
          )}

          <textarea
            value={customPrompt}
            onChange={(event) => setCustomPrompt(event.target.value)}
            className="min-h-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Prompt tùy chỉnh"
          />

          <Button onClick={onSummarize} disabled={summarizing || !canSummarize}>
            {summarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Tóm tắt
          </Button>
          {summaryError && <p className="text-sm text-red-600">{summaryError}</p>}
        </div>

        {summary && (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 text-sm font-semibold text-gray-900">Kết quả tóm tắt</div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{summary}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
