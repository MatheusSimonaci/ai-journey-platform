"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  slug: string;
  enrolled: boolean;
  buttonClass: string;
};

export function TrackEnrollButton({ slug, enrolled, buttonClass }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (enrolled) return null;

  async function handleEnroll() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tracks/${slug}/enroll`, {
        method: "POST",
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
      onClick={handleEnroll}
      disabled={loading}
      className={`text-sm font-medium px-4 py-2 rounded-lg ${buttonClass} disabled:opacity-50`}
    >
      {loading ? "Inscrevendo..." : "Inscrever-se →"}
    </button>
  );
}
