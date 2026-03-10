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
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [fallbackTargetCount, setFallbackTargetCount] = useState(10);

  const [customPrompt, setCustomPrompt] = useState(
    "Câu trả lời gồm 2 phần. [1] Nội dung ngắn: Trả lời đúng 1 câu duy nhất, tóm tắt cốt lõi của tài liệu. [2] Nội dung dài: Tóm tắt chi tiết khoảng 1 trang A4, mạch lạc, trung tính, có cấu trúc với các đoạn rõ ràng.",
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

      setSearchResult(data as NewsSearchResponse);
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
          throw new Error("Vui lòng chọn tệp PDF trước.");
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
          Tìm tin theo chủ đề, địa lý và thời gian với SerpAPI. Có thể dùng OpenAI để tối ưu truy vấn tìm kiếm.
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
              placeholder="Số kết quả"
            />
            <input
              type="number"
              min={0}
              max={90}
              value={form.timeframeDays}
              onChange={onNumberInput("timeframeDays")}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Số ngày"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.useAiQuery}
              onChange={(event) => setForm((prev) => ({ ...prev, useAiQuery: event.target.checked }))}
            />
            Dùng OpenAI để tối ưu truy vấn
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={fallbackEnabled}
              onChange={(event) => setFallbackEnabled(event.target.checked)}
            />
            Fallback: bổ sung bài cũ nếu bài mới không đủ
          </label>

          {fallbackEnabled && (
            <input
              type="number"
              min={1}
              max={20}
              value={fallbackTargetCount}
              onChange={(event) => setFallbackTargetCount(Number(event.target.value) || 1)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Tổng số bài mong muốn"
            />
          )}

          <div className="flex gap-2">
            <Button onClick={onSearchNews} disabled={searching}>
              {searching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Tìm tin
            </Button>
            <Button type="button" variant="secondary" onClick={downloadCsv} disabled={!displayArticles.length}>
              <Download className="mr-2 h-4 w-4" />
              Xuất CSV
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
              <div className="mt-1 text-gray-600">Đã chọn để tóm tắt: {selectedArticles.length}</div>
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
                          {isOld ? " | Bài cũ bổ sung" : ""}
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
          Tóm tắt từ tin đã tìm, URL, PDF URL, PDF tải lên hoặc văn bản thô với prompt tùy chỉnh.
        </p>

        <div className="grid gap-3">
          <select
            value={sourceMode}
            onChange={(event) => setSourceMode(event.target.value as SummarizeMode)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="news">Nguồn: Tin đã chọn</option>
            <option value="url">Nguồn: URL trang web</option>
            <option value="pdf-url">Nguồn: URL PDF</option>
            <option value="pdf-upload">Nguồn: Tải lên PDF</option>
            <option value="text">Nguồn: Văn bản thô</option>
          </select>

          <select
            value={outputLanguage}
            onChange={(event) => setOutputLanguage(event.target.value as "vi" | "en")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="vi">Đầu ra: Tiếng Việt</option>
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
              placeholder="Dán nội dung cần tóm tắt..."
            />
          )}

          <textarea
            value={customPrompt}
            onChange={(event) => setCustomPrompt(event.target.value)}
            className="min-h-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Câu trả lời gồm 2 phần. [1] Nội dung ngắn: Trả lời đúng 1 câu duy nhất, tóm tắt cốt lõi của tài liệu. [2] Nội dung dài: Tóm tắt chi tiết khoảng 1 trang A4, mạch lạc, trung tính, có cấu trúc với các đoạn rõ ràng."
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
