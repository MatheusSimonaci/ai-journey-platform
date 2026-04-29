import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const COLOR_MAP: Record<string, { card: string; badge: string; btn: string; progress: string }> = {
  blue: {
    card: "border-blue-100 hover:border-blue-300",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    btn: "bg-blue-600 hover:bg-blue-700 text-white",
    progress: "bg-blue-500",
  },
  purple: {
    card: "border-purple-100 hover:border-purple-300",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    btn: "bg-purple-600 hover:bg-purple-700 text-white",
    progress: "bg-purple-500",
  },
  orange: {
    card: "border-orange-100 hover:border-orange-300",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    btn: "bg-orange-600 hover:bg-orange-700 text-white",
    progress: "bg-orange-500",
  },
};

export default async function TracksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tracks = await db.track.findMany({
    include: {
      resources: { select: { resourceId: true } },
      enrollments: {
        where: { userId: session.user.id },
        select: { enrolledAt: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const resourceIds = tracks.flatMap((t) => t.resources.map((r) => r.resourceId));
  const progress = await db.userProgress.findMany({
    where: { userId: session.user.id, resourceId: { in: resourceIds }, status: "completed" },
    select: { resourceId: true },
  });
  const completedSet = new Set(progress.map((p) => p.resourceId));

  const trackData = tracks.map((track) => {
    const total = track.resources.length;
    const completed = track.resources.filter((r) => completedSet.has(r.resourceId)).length;
    const enrolled = track.enrollments.length > 0;
    const colors = COLOR_MAP[track.color] ?? COLOR_MAP.blue;
    return { ...track, total, completed, enrolled, colors };
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 text-sm">← Dashboard</Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-lg font-semibold text-slate-900">Trilhas por Área</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Escolha sua trilha</h2>
          <p className="text-slate-500">
            Trilhas temáticas com recursos curados para sua área de atuação — jurídico, criativo ou gestão de tecnologia.
          </p>
        </div>

        <div className="grid gap-6">
          {trackData.map((track) => (
            <Link
              key={track.id}
              href={`/tracks/${track.slug}`}
              className={`bg-white rounded-2xl border-2 p-7 shadow-sm transition-colors block ${track.colors.card}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{track.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{track.title}</h3>
                      {track.enrolled && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${track.colors.badge}`}>
                          Inscrito
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-500 leading-relaxed">{track.description}</p>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{track.total} recursos</span>
                    {track.enrolled && track.completed > 0 && (
                      <span className="text-green-600 font-medium">{track.completed} concluídos</span>
                    )}
                  </div>

                  {track.enrolled && track.total > 0 && (
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-100 rounded-full w-full max-w-xs">
                        <div
                          className={`h-2 rounded-full transition-all ${track.colors.progress}`}
                          style={{ width: `${(track.completed / track.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400">
                        {Math.round((track.completed / track.total) * 100)}% concluído
                      </p>
                    </div>
                  )}
                </div>
                <div className={`shrink-0 text-sm font-medium px-4 py-2 rounded-lg ${track.colors.btn}`}>
                  {track.enrolled ? "Continuar →" : "Ver trilha →"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
