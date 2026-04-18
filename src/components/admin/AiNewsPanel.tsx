"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  Bot,
  CalendarDays,
  FileText,
  FileUp,
  Globe2,
  Languages,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Newspaper,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Type,
} from "lucide-react";
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
const MAX_PDF_UPLOAD_BYTES = 4 * 1024 * 1024;

const initialSearchForm: SearchFormState = {
  topic: "nông nghiệp bền vững",
  geoScope: "Việt Nam, ASEAN",
  engine: "google_news",
  lang: "vi",
  maxResults: 10,
  timeframeDays: 7,
  useAiQuery: true,
};

async function readApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { error: text || "Invalid JSON response from server" };
    }
  }

  return { error: text || `Request failed with status ${response.status}` };
}

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

      const data = await readApiResponse(response);
      if (!response.ok) {
        throw new Error(String(data.error || "Search failed"));
      }

      setSearchResult(data as unknown as NewsSearchResponse);
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

        if (pdfFile.size > MAX_PDF_UPLOAD_BYTES) {
          throw new Error("PDF tải lên quá lớn. Vui lòng dùng file dưới 4MB hoặc dùng nguồn PDF URL.");
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

      const data = await readApiResponse(response);
      if (!response.ok) {
        throw new Error(String(data.error || "Summarization failed"));
      }

      setSummary(String(data.summary || ""));
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

        <div className="grid gap-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="rounded-md bg-white p-2 text-blue-700">
                <Search className="h-4 w-4" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">1. Nhập nội dung cần tìm</label>
                <p className="mt-1 text-xs text-gray-600">Mô tả chủ đề và khu vực để AI tìm đúng nhóm tin cần thu thập.</p>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <FileText className="h-4 w-4 text-gray-500" />
                  Chủ đề
                </label>
                <input
                  value={form.topic}
                  onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
                  className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: nông nghiệp bền vững"
                />
              </div>
              <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Phạm vi địa lý
                </label>
                <input
                  value={form.geoScope}
                  onChange={(event) => setForm((prev) => ({ ...prev, geoScope: event.target.value }))}
                  className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Việt Nam, ASEAN"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="rounded-md bg-white p-2 text-indigo-700">
                <Globe2 className="h-4 w-4" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">2. Chọn nguồn tìm kiếm và ngôn ngữ</label>
                <p className="mt-1 text-xs text-gray-600">Google News thường phù hợp nhất cho tin mới; Google Search rộng hơn.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={form.engine}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, engine: event.target.value as NewsSearchEngine }))
                }
                className="rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="google_news">Google News</option>
                <option value="google">Google Search</option>
                <option value="bing_news">Bing News</option>
              </select>
              <select
                value={form.lang}
                onChange={(event) => setForm((prev) => ({ ...prev, lang: event.target.value as "vi" | "en" }))}
                className="rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="rounded-md bg-white p-2 text-slate-700">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">3. Giới hạn kết quả</label>
                <p className="mt-1 text-xs text-gray-600">Điều chỉnh số tin và khoảng thời gian để danh sách không quá rộng.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Newspaper className="h-4 w-4 text-gray-500" />
                  Số kết quả mới
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.maxResults}
                  onChange={onNumberInput("maxResults")}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Số kết quả"
                />
              </div>
              <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  Số ngày gần đây
                </label>
                <input
                  type="number"
                  min={0}
                  max={90}
                  value={form.timeframeDays}
                  onChange={onNumberInput("timeframeDays")}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Số ngày"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="rounded-md bg-white p-2 text-amber-700">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">4. Tùy chọn hỗ trợ AI</label>
                <p className="mt-1 text-xs text-gray-600">Giữ mặc định nếu muốn AI tự tối ưu truy vấn và bổ sung bài cũ khi thiếu tin mới.</p>
              </div>
            </div>
            <div className="grid gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.useAiQuery}
                  onChange={(event) => setForm((prev) => ({ ...prev, useAiQuery: event.target.checked }))}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                Dùng OpenAI để tối ưu truy vấn
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={fallbackEnabled}
                  onChange={(event) => setFallbackEnabled(event.target.checked)}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                Bổ sung bài cũ nếu bài mới không đủ
              </label>

              {fallbackEnabled && (
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-800">Tổng số bài mong muốn</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={fallbackTargetCount}
                    onChange={(event) => setFallbackTargetCount(Number(event.target.value) || 1)}
                    className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Tổng số bài mong muốn"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={onSearchNews} disabled={searching} className="h-12 text-base font-semibold">
              {searching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Tìm tin
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
          Tóm tắt từ tin đã tìm, URL, PDF URL, PDF tải lên tối đa 4MB hoặc văn bản thô với prompt tùy chỉnh.
        </p>

        <div className="grid gap-4">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="rounded-md bg-white p-2 text-emerald-700">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">1. Chọn nguồn cần tóm tắt</label>
                <p className="mt-1 text-xs text-gray-600">Dùng tin đã chọn, link bài viết, PDF, hoặc dán văn bản trực tiếp.</p>
              </div>
            </div>
            <select
              value={sourceMode}
              onChange={(event) => setSourceMode(event.target.value as SummarizeMode)}
              className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="news">Tin đã chọn từ Content Finder</option>
              <option value="url">URL trang web</option>
              <option value="pdf-url">PDF URL</option>
              <option value="pdf-upload">Tải lên PDF</option>
              <option value="text">Văn bản thô</option>
            </select>
            {sourceMode === "news" && (
              <p className="mt-2 text-xs text-emerald-700">
                Đã chọn {selectedArticles.length} tin. Chọn một tin ở danh sách bên trái trước khi tóm tắt.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-sky-100 bg-sky-50/60 p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="rounded-md bg-white p-2 text-sky-700">
                <Languages className="h-4 w-4" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">2. Chọn ngôn ngữ đầu ra</label>
                <p className="mt-1 text-xs text-gray-600">Kết quả tóm tắt sẽ được viết bằng ngôn ngữ này.</p>
              </div>
            </div>
            <select
              value={outputLanguage}
              onChange={(event) => setOutputLanguage(event.target.value as "vi" | "en")}
              className="w-full rounded-md border border-sky-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          {sourceMode === "url" && (
            <div className="grid gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <LinkIcon className="h-4 w-4 text-gray-500" />
                URL bài viết
              </label>
              <input
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://example.com/article"
              />
            </div>
          )}

          {sourceMode === "pdf-url" && (
            <div className="grid gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <FileText className="h-4 w-4 text-gray-500" />
                PDF URL
              </label>
              <input
                value={pdfUrl}
                onChange={(event) => setPdfUrl(event.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://example.com/report.pdf"
              />
            </div>
          )}

          {sourceMode === "pdf-upload" && (
            <div className="grid gap-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <FileUp className="h-4 w-4 text-gray-500" />
                Tải lên PDF
              </label>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] || null;
                  if (nextFile && nextFile.size > MAX_PDF_UPLOAD_BYTES) {
                    setPdfFile(null);
                    setSummaryError("PDF tải lên quá lớn. Vui lòng dùng file dưới 4MB hoặc dùng nguồn PDF URL.");
                    event.target.value = "";
                    return;
                  }

                  setSummaryError("");
                  setPdfFile(nextFile);
                }}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500">Tối đa 4MB cho PDF tải lên. File lớn hơn nên dùng PDF URL.</p>
            </div>
          )}

          {sourceMode === "text" && (
            <div className="grid gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Type className="h-4 w-4 text-gray-500" />
                Văn bản cần tóm tắt
              </label>
              <textarea
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
                className="min-h-28 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Dán nội dung cần tóm tắt..."
              />
            </div>
          )}

          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="rounded-md bg-white p-2 text-amber-700">
                <Settings2 className="h-4 w-4" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">3. Yêu cầu tóm tắt</label>
                <p className="mt-1 text-xs text-gray-600">Có thể giữ mẫu mặc định hoặc chỉnh lại theo nhu cầu.</p>
              </div>
            </div>
            <textarea
              value={customPrompt}
              onChange={(event) => setCustomPrompt(event.target.value)}
              className="min-h-28 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Mô tả cách bạn muốn AI tóm tắt..."
            />
          </div>

          <Button onClick={onSummarize} disabled={summarizing || !canSummarize} className="h-12 text-base font-semibold">
            {summarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Tạo bản tóm tắt
          </Button>
          {summaryError && <p className="text-sm text-red-600">{summaryError}</p>}
        </div>

        {summary && (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 text-sm font-semibold text-gray-900">Kết quả tóm tắt</div>
            <div className="whitespace-pre-wrap text-sm text-gray-800">{summary}</div>
          </div>
        )}
      </section>
    </div>
  );
}
