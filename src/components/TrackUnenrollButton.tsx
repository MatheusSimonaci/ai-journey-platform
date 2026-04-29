"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  slug: string;
};

export function TrackUnenrollButton({ slug }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUnenroll() {
    if (!confirm("Tem certeza que quer deixar esta trilha?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/tracks/${slug}/enroll`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUnenroll}
      disabled={loading}
      className="text-sm text-slate-600 hover:text-slate-900 font-medium disabled:opacity-50"
    >
      {loading ? "Saindo..." : "Deixar trilha"}
    </button>
  );
}
