"use client";

import { useState } from "react";

type Platform = "linkedin" | "twitter" | "instagram";

type LinkedInContent = { text: string; url?: string };
type TwitterContent = { tweets: string[] };
type InstagramContent = { caption: string; hashtags: string[] };

type FormattedContent = LinkedInContent | TwitterContent | InstagramContent;

type ExportResult = {
  id: string;
  platform: Platform;
  formatted: { platform: Platform; content: FormattedContent };
};

type Props = {
  entryId: string;
  entryTitle: string;
  onClose: () => void;
};

const PLATFORM_META: Record<Platform, { label: string; icon: string; color: string }> = {
  linkedin: { label: "LinkedIn", icon: "in", color: "bg-blue-700" },
  twitter: { label: "Twitter / X", icon: "𝕏", color: "bg-black" },
  instagram: { label: "Instagram", icon: "IG", color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" },
};

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  });
}

function LinkedInPreview({ content }: { content: LinkedInContent }) {
  const [copied, setCopied] = useState(false);
  const text = content.url ? `${content.text}\n\n${content.url}` : content.text;

  const handleCopy = () => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="bg-white border border-slate-200 rounded-xl p-4 whitespace-pre-wrap text-sm text-slate-800 leading-relaxed max-h-72 overflow-y-auto">
        {content.text}
        {content.url && <span className="block mt-2 text-blue-600 text-xs">{content.url}</span>}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>{content.text.length} caracteres</span>
        {content.url && <span>· URL incluída</span>}
      </div>
      <button
        onClick={handleCopy}
        className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {copied ? "Copiado!" : "Copiar post"}
      </button>
    </div>
  );
}

function TwitterPreview({ content }: { content: TwitterContent }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleCopyTweet = (idx: number, text: string) => {
    copyToClipboard(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    copyToClipboard(content.tweets.join("\n\n---\n\n"));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {content.tweets.map((tweet, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3">
            <div className="flex-1">
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{tweet}</p>
              <p className="text-xs text-slate-400 mt-1">{tweet.length}/280</p>
            </div>
            <button
              onClick={() => handleCopyTweet(i, tweet)}
              className="shrink-0 text-xs text-slate-500 hover:text-black border border-slate-200 rounded-lg px-2 py-1 h-fit"
            >
              {copiedIdx === i ? "✓" : "Copiar"}
            </button>
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-500">{content.tweets.length} tweet(s) na thread</div>
      <button
        onClick={handleCopyAll}
        className="w-full py-2 px-4 bg-black hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {allCopied ? "Copiado!" : "Copiar thread completa"}
      </button>
    </div>
  );
}

function InstagramPreview({ content }: { content: InstagramContent }) {
  const [copied, setCopied] = useState(false);
  const full = `${content.caption}\n\n${content.hashtags.join(" ")}`;

  const handleCopy = () => {
    copyToClipboard(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="bg-white border border-slate-200 rounded-xl p-4 max-h-72 overflow-y-auto space-y-2">
        <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{content.caption}</p>
        {content.hashtags.length > 0 && (
          <p className="text-sm text-blue-500 leading-relaxed">{content.hashtags.join(" ")}</p>
        )}
      </div>
      <div className="text-xs text-slate-500">{content.hashtags.length} hashtag(s)</div>
      <button
        onClick={handleCopy}
        className="w-full py-2 px-4 text-white rounded-lg text-sm font-medium transition-colors bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90"
      >
        {copied ? "Copiado!" : "Copiar legenda"}
      </button>
    </div>
  );
}

function renderPreview(result: ExportResult) {
  const { platform, formatted } = result;
  if (platform === "linkedin") return <LinkedInPreview content={formatted.content as LinkedInContent} />;
  if (platform === "twitter") return <TwitterPreview content={formatted.content as TwitterContent} />;
  if (platform === "instagram") return <InstagramPreview content={formatted.content as InstagramContent} />;
  return null;
}

export default function SocialExportModal({ entryId, entryTitle, onClose }: Props) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (platform: Platform) => {
    setSelectedPlatform(platform);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/social/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ knowledgeEntryId: entryId, platform }),
      });

      if (!res.ok) throw new Error("Falha ao gerar formato");
      const data: ExportResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Distribuir conteúdo</h2>
              <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">{entryTitle}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold leading-none">
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Platform selector */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Escolha a plataforma</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(PLATFORM_META) as [Platform, typeof PLATFORM_META[Platform]][]).map(
                ([platform, meta]) => (
                  <button
                    key={platform}
                    onClick={() => handleExport(platform)}
                    disabled={loading}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium
                      ${selectedPlatform === platform
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${meta.color}`}
                    >
                      {meta.icon}
                    </span>
                    <span className="text-slate-700">{meta.label}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Preview area */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-sm text-slate-500">Formatando...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {result && !loading && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">
                Preview — {PLATFORM_META[result.platform].label}
              </p>
              {renderPreview(result)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
