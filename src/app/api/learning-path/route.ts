import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = await db.learningPath.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { resource: true },
      },
    },
  });

  if (!path) {
    return NextResponse.json({ path: null });
  }

  const progress = await db.userProgress.findMany({
    where: { userId: session.user.id },
  });

  const progressMap = Object.fromEntries(progress.map((p) => [p.resourceId, p.status]));

  return NextResponse.json({
    path: {
      stage: path.stage,
      summary: path.summary,
      generatedAt: path.generatedAt,
      items: path.items.map((item) => ({
        ...item.resource,
        order: item.order,
        status: progressMap[item.resourceId] ?? "not_started",
      })),
    },
  });
}
