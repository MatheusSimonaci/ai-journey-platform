"use client";

import { useState } from "react";

export type ResourceItem = {
  id: string;
  title: string;
  url: string;
  type: string;
  description: string | null;
  tags: string[];
  order: number;
  status: string;
};

const TYPE_BADGE: Record<string, string> = {
  article: "bg-slate-100 text-slate-700",
  video: "bg-red-100 text-red-700",
  course: "bg-blue-100 text-blue-700",
  tool: "bg-green-100 text-green-700",
  book: "bg-amber-100 text-amber-700",
};

type Props = {
  resource: ResourceItem;
  index: number;
};

export function ResourceCard({ resource, index }: Props) {
  const [status, setStatus] = useState(resource.status);
  const [loading, setLoading] = useState(false);

  const isCompleted = status === "completed";

  async function toggleComplete() {
    setLoading(true);
    const next = isCompleted ? "not_started" : "completed";
    try {
      const res = await fetch(`/api/progress/${resource.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        setStatus(next);
      }
    } finally {
      setLoading(false);
    }
  }

  const badgeClass = TYPE_BADGE[resource.type] ?? "bg-slate-100 text-slate-700";

  return (
    <div
      className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${
        isCompleted ? "border-green-200 opacity-80" : "border-slate-100"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-400">{index + 1}.</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${badgeClass}`}>
              {resource.type}
            </span>
          </div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-medium text-slate-900 hover:text-blue-600 transition-colors"
          >
            {resource.title} ↗
          </a>
          {resource.description && (
            <p className="text-sm text-slate-500 line-clamp-2">{resource.description}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={toggleComplete}
          disabled={loading}
          className={`shrink-0 text-sm font-medium px-4 py-2 rounded-lg border transition-all disabled:opacity-50 ${
            isCompleted
              ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
              : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {isCompleted ? "Concluído ✓" : "Marcar como concluído"}
        </button>
      </div>
    </div>
  );
}
