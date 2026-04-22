import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateLearningPath, type OnboardingAnswers } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();
  const answers = body.answers as OnboardingAnswers;

  if (!answers?.experience || !answers?.goal || !answers?.domain || !answers?.time || !answers?.style) {
    return NextResponse.json({ error: "Missing required answers" }, { status: 400 });
  }

  const resources = await db.resource.findMany({
    select: { id: true, title: true, type: true, stages: true, tags: true },
  });

  const { stage, summary, resourceIds } = await generateLearningPath(answers, resources);

  const validIds = resourceIds.filter((id) => resources.some((r) => r.id === id));

  await db.$transaction(async (tx) => {
    await tx.onboardingResponse.upsert({
      where: { userId },
      create: { userId, answers, stage, updatedAt: new Date() },
      update: { answers, stage, updatedAt: new Date() },
    });

    const existing = await tx.learningPath.findUnique({ where: { userId } });
    if (existing) {
      await tx.learningPathItem.deleteMany({ where: { learningPathId: existing.id } });
      await tx.learningPath.update({
        where: { userId },
        data: {
          stage,
          summary,
          generatedAt: new Date(),
          updatedAt: new Date(),
          items: {
            create: validIds.map((resourceId, order) => ({ resourceId, order })),
          },
        },
      });
    } else {
      await tx.learningPath.create({
        data: {
          userId,
          stage,
          summary,
          items: {
            create: validIds.map((resourceId, order) => ({ resourceId, order })),
          },
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
