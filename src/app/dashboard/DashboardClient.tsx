"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { ResourceCard, type ResourceItem } from "@/components/ResourceCard";
import { useEventTracking } from "@/lib/use-event-tracking";

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  aware: { label: "Consciente", color: "bg-purple-100 text-purple-800" },
  exploring: { label: "Explorando", color: "bg-blue-100 text-blue-800" },
  applying: { label: "Aplicando", color: "bg-green-100 text-green-800" },
  building: { label: "Construindo", color: "bg-orange-100 text-orange-800" },
};

type Props = {
  userName: string;
  stage: string;
  summary: string;
  items: ResourceItem[];
  completedCount: number;
};

export default function DashboardClient({ userName, stage, summary, items, completedCount }: Props) {
  useEventTracking();
  const [resources] = useState(items);
  const stageInfo = STAGE_LABELS[stage] ?? { label: stage, color: "bg-slate-100 text-slate-800" };
  const total = resources.length;
  const progress = total > 0 ? (completedCount / total) * 100 : 0;

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
              {stageInfo.label}
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed">{summary}</p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700">Seu progresso</span>
            <span className="text-slate-500">{completedCount} de {total} recursos</span>
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
            <ResourceCard key={resource.id} resource={resource} index={idx} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <a
            href="/tracks"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            Trilhas por Área →
          </a>
          <a
            href="/conhecimento"
            className="text-sm bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            Base de Conhecimento →
          </a>
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
