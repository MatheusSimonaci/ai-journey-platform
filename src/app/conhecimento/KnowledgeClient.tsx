"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const SocialExportModal = dynamic(() => import("@/components/SocialExportModal"), { ssr: false });

type KnowledgeEntry = {
  id: string;
  title: string;
  body: string;
  url?: string | null;
  tags: string[];
  createdAt: string;
  _count?: { socialExports: number };
};

type Props = {
  initialEntries: KnowledgeEntry[];
  userName: string;
};

function EntryCard({
  entry,
  onExport,
}: {
  entry: KnowledgeEntry;
  onExport: (entry: KnowledgeEntry) => void;
}) {
  const date = new Date(entry.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
      <div className="flex justify-between items-start gap-3">
        <h3 className="font-semibold text-slate-900 leading-snug">{entry.title}</h3>
        <button
          onClick={() => onExport(entry)}
          className="shrink-0 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          Distribuir
        </button>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{entry.body}</p>
      {entry.url && (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-blue-500 hover:text-blue-700 truncate"
        >
          {entry.url}
        </a>
      )}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
          {(entry._count?.socialExports ?? 0) > 0 && (
            <span>{entry._count!.socialExports} export(s)</span>
          )}
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

function NewEntryForm({ onCreated }: { onCreated: (entry: KnowledgeEntry) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", url: "", tags: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, body: form.body, url: form.url || undefined, tags }),
      });

      if (!res.ok) throw new Error("Falha ao criar entrada");
      const entry: KnowledgeEntry = await res.json();
      onCreated(entry);
      setForm({ title: "", body: "", url: "", tags: "" });
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 px-5 font-medium text-sm transition-colors"
      >
        + Nova entrada
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-blue-200 space-y-4">
      <h3 className="font-semibold text-slate-900">Nova entrada</h3>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Título *</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Título do conteúdo"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Conteúdo *</label>
        <textarea
          required
          rows={5}
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Escreva o conteúdo principal aqui..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">URL de referência (opcional)</label>
        <input
          type="url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Tags (separadas por vírgula)</label>
        <input
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="ia, produtividade, aprendizado"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg py-2 text-sm transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}

export default function KnowledgeClient({ initialEntries, userName }: Props) {
  const [entries, setEntries] = useState<KnowledgeEntry[]>(initialEntries);
  const [exportTarget, setExportTarget] = useState<KnowledgeEntry | null>(null);

  const handleCreated = (entry: KnowledgeEntry) => {
    setEntries([entry, ...entries]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-sm text-slate-400 hover:text-slate-600">← Dashboard</a>
          <span className="text-slate-300">/</span>
          <h1 className="text-lg font-semibold text-slate-900">Base de Conhecimento</h1>
        </div>
        <span className="text-sm text-slate-600">{userName}</span>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div className="space-y-1">
          <p className="text-slate-500 text-sm">
            Crie entradas de conteúdo e distribua automaticamente para LinkedIn, Twitter e Instagram.
          </p>
        </div>

        <NewEntryForm onCreated={handleCreated} />

        {entries.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Nenhuma entrada ainda. Crie sua primeira acima.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onExport={setExportTarget} />
            ))}
          </div>
        )}
      </main>

      {exportTarget && (
        <SocialExportModal
          entryId={exportTarget.id}
          entryTitle={exportTarget.title}
          onClose={() => setExportTarget(null)}
        />
      )}
    </div>
  );
}
