import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();
  const validStatuses = ["not_started", "in_progress", "completed", "skipped"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const progress = await db.userProgress.upsert({
    where: { userId_resourceId: { userId: session.user.id, resourceId: params.resourceId } },
    create: {
      userId: session.user.id,
      resourceId: params.resourceId,
      status,
      completedAt: status === "completed" ? new Date() : null,
    },
    update: {
      status,
      completedAt: status === "completed" ? new Date() : null,
    },
  });

  return NextResponse.json({ progress });
}
