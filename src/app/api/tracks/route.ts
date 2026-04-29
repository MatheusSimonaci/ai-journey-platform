import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackServerEvent } from "@/lib/server-events";

export async function GET() {
  const session = await auth();

  const tracks = await db.track.findMany({
    include: {
      resources: {
        orderBy: { order: "asc" },
        include: { resource: true },
      },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  let enrollmentMap: Record<string, boolean> = {};
  let progressMap: Record<string, string> = {};

  if (session?.user?.id) {
    const enrollments = await db.trackEnrollment.findMany({
      where: { userId: session.user.id },
      select: { trackId: true },
    });
    enrollmentMap = Object.fromEntries(enrollments.map((e) => [e.trackId, true]));

    const resourceIds = tracks.flatMap((t) => t.resources.map((r) => r.resourceId));
    const progress = await db.userProgress.findMany({
      where: { userId: session.user.id, resourceId: { in: resourceIds } },
    });
    progressMap = Object.fromEntries(progress.map((p) => [p.resourceId, p.status]));

    await trackServerEvent("tracks_viewed", session.user.id, {});
  }

  const result = tracks.map((track) => {
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
    return {
      id: track.id,
      slug: track.slug,
      title: track.title,
      description: track.description,
      icon: track.icon,
      color: track.color,
      domain: track.domain,
      resourceCount: resources.length,
      completedCount: completed,
      enrolledCount: track._count.enrollments,
      enrolled: enrollmentMap[track.id] ?? false,
    };
  });

  return NextResponse.json({ tracks: result });
}
