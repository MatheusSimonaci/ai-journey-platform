import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ResourceCard } from "@/components/ResourceCard";
import { TrackEnrollButton } from "@/components/TrackEnrollButton";
import { TrackUnenrollButton } from "@/components/TrackUnenrollButton";

const COLOR_MAP: Record<string, { badge: string; btn: string; progress: string; icon_bg: string }> = {
  blue: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    btn: "bg-blue-600 hover:bg-blue-700 text-white",
    progress: "bg-blue-500",
    icon_bg: "bg-blue-100",
  },
  purple: {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    btn: "bg-purple-600 hover:bg-purple-700 text-white",
    progress: "bg-purple-500",
    icon_bg: "bg-purple-100",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    btn: "bg-orange-600 hover:bg-orange-700 text-white",
    progress: "bg-orange-500",
    icon_bg: "bg-orange-100",
  },
};

export default async function TrackDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const track = await db.track.findUnique({
    where: { slug: params.slug },
    include: {
      resources: {
        orderBy: { order: "asc" },
        include: { resource: true },
      },
    },
  });

  if (!track) {
    redirect("/tracks");
  }

  const enrollment = await db.trackEnrollment.findUnique({
    where: { trackId_userId: { trackId: track.id, userId: session.user.id } },
  });

  const resourceIds = track.resources.map((r) => r.resourceId);
  const progress = await db.userProgress.findMany({
    where: { userId: session.user.id, resourceId: { in: resourceIds } },
  });
  const progressMap = Object.fromEntries(progress.map((p) => [p.resourceId, p.status]));

  const resources = track.resources.map((tr) => ({
    id: tr.resource.id,
    title: tr.resource.title,
    description: tr.resource.description,
    url: tr.resource.url,
    type: tr.resource.type,
    tags: tr.resource.tags,
    order: tr.order,
    status: progressMap[tr.resource.id] ?? "not_started",
  }));

  const completed = resources.filter((r) => r.status === "completed").length;
  const colors = COLOR_MAP[track.color] ?? COLOR_MAP.blue;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/tracks" className="text-slate-500 hover:text-slate-700 text-sm">
            ← Trilhas
          </Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-lg font-semibold text-slate-900">{track.title}</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className={`${colors.icon_bg} rounded-lg p-4 text-4xl flex-shrink-0`}>
              {track.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900">{track.title}</h2>
              <p className="text-slate-600 mt-2 leading-relaxed">{track.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
                <span className="font-medium">{resources.length} recursos</span>
                {enrollment && completed > 0 && (
                  <span className="text-green-600 font-medium">{completed} concluídos</span>
                )}
              </div>
            </div>
          </div>

          {enrollment && resources.length > 0 && (
            <div className="space-y-2 bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Progresso na trilha</span>
                <span className="text-sm font-bold text-slate-900">
                  {Math.round((completed / resources.length) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-3 transition-all ${colors.progress}`}
                  style={{ width: `${(completed / resources.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Recursos da Trilha</h3>
            <TrackEnrollButton
              slug={params.slug}
              enrolled={!!enrollment}
              buttonClass={colors.btn}
            />
          </div>

          <div className="space-y-3">
            {resources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
              />
            ))}
          </div>
        </div>

        {enrollment && (
          <div className="border-t border-slate-200 pt-6">
            <TrackUnenrollButton slug={params.slug} />
          </div>
        )}
      </main>
    </div>
  );
}
