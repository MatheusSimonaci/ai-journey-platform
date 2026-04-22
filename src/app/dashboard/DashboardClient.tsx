"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type Resource = {
  id: string;
  title: string;
  url: string;
  type: string;
  stages: string[];
  tags: string[];
  description: string | null;
  order: number;
  status: string;
};

type Props = {
  userName: string;
  stage: string;
  summary: string;
  items: Resource[];
  completedCount: number;
};

const STAGE_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  aware: { label: "Consciente", emoji: "🌱", color: "bg-green-100 text-green-800" },
  exploring: { label: "Explorando", emoji: "🔍", color: "bg-blue-100 text-blue-800" },
  applying: { label: "Aplicando", emoji: "⚡", color: "bg-yellow-100 text-yellow-800" },
  building: { label: "Construindo", emoji: "🚀", color: "bg-purple-100 text-purple-800" },
};

const TYPE_ICONS: Record<string, string> = {
  article: "📄",
  video: "🎥",
  course: "🎓",
  tool: "🔧",
  book: "📚",
};

const STATUS_OPTIONS = [
  { value: "not_started", label: "Não iniciado", color: "text-slate-500" },
  { value: "in_progress", label: "Em progresso", color: "text-blue-600" },
  { value: "completed", label: "Concluído", color: "text-green-600" },
  { value: "skipped", label: "Pulado", color: "text-slate-400" },
];

export default function DashboardClient({ userName, stage, summary, items, completedCount }: Props) {
  const [resources, setResources] = useState(items);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const stageInfo = STAGE_LABELS[stage] ?? { label: stage, emoji: "🤖", color: "bg-slate-100 text-slate-800" };
  const total = resources.length;
  const completed = resources.filter((r) => r.status === "completed").length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  async function updateStatus(resourceId: string, status: string) {
    setUpdatingId(resourceId);
    try {
      await fetch(`/api/progress/${resourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setResources((prev) =>
        prev.map((r) => (r.id === resourceId ? { ...r, status } : r))
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-slate-900">Jornada IA</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{userName}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Sair
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Stage & Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${stageInfo.color}`}>
              {stageInfo.emoji} {stageInfo.label}
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed">{summary}</p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700">Seu progresso</span>
            <span className="text-slate-500">{completed} de {total} recursos</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full">
            <div
              className="h-3 bg-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">{Math.round(progress)}% concluído</p>
        </div>

        {/* Resource list */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Seu caminho de aprendizado</h2>
          {resources.map((resource, idx) => (
            <div
              key={resource.id}
              className={`bg-white rounded-xl border p-5 shadow-sm transition-opacity ${
                resource.status === "skipped" ? "opacity-50" : ""
              } ${resource.status === "completed" ? "border-green-200" : "border-slate-100"}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-xl mt-0.5">{TYPE_ICONS[resource.type] ?? "📎"}</span>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-900 hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {idx + 1}. {resource.title}
                    </a>
                    <span className="shrink-0 text-xs text-slate-400 capitalize">{resource.type}</span>
                  </div>
                  {resource.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">{resource.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0">
                  <select
                    value={resource.status}
                    disabled={updatingId === resource.id}
                    onChange={(e) => updateStatus(resource.id, e.target.value)}
                    className={`text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white cursor-pointer ${
                      STATUS_OPTIONS.find((s) => s.value === resource.status)?.color ?? ""
                    }`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <a
            href="/onboarding"
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            Refazer questionário e atualizar caminho →
          </a>
        </div>
      </main>
    </div>
  );
}
