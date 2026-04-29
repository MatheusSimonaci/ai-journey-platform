import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackServerEvent } from "@/lib/server-events";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth();

  const track = await db.track.findUnique({
    where: { slug: params.slug },
    include: {
      resources: {
        orderBy: { order: "asc" },
        include: { resource: true },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  let progressMap: Record<string, string> = {};
  let enrolled = false;

  if (session?.user?.id) {
    const resourceIds = track.resources.map((r) => r.resourceId);
    const progress = await db.userProgress.findMany({
      where: { userId: session.user.id, resourceId: { in: resourceIds } },
    });
    progressMap = Object.fromEntries(progress.map((p) => [p.resourceId, p.status]));

    const enrollment = await db.trackEnrollment.findUnique({
      where: { trackId_userId: { trackId: track.id, userId: session.user.id } },
    });
    enrolled = !!enrollment;

    await trackServerEvent("track_viewed", session.user.id, {
      track_slug: track.slug,
      track_domain: track.domain,
      enrolled,
    });
  }

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

  return NextResponse.json({
    track: {
      id: track.id,
      slug: track.slug,
      title: track.title,
      description: track.description,
      icon: track.icon,
      color: track.color,
      domain: track.domain,
      enrolledCount: track._count.enrollments,
      enrolled,
      resources,
      completedCount: completed,
    },
  });
}
