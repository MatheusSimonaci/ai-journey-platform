import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateLearningPath } from "@/lib/claude";
import { trackServerEvent } from "@/lib/server-events";

const schema = z.object({
  experience: z.enum(["aware", "exploring", "applying", "building"]),
  goal: z.enum(["stay_informed", "apply_to_work", "build_products", "research"]),
  domain: z.enum(["tech", "business", "creative", "healthcare", "education", "legal", "other"]),
  timeAvailable: z.enum(["under_1h", "1_3h", "3_5h", "over_5h"]),
  learningStyle: z.enum(["reading", "video", "hands_on", "mixed"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const body: unknown = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const answers = parsed.data;

  const resources = await db.resource.findMany({
    select: { id: true, title: true, type: true, stages: true, tags: true },
  });

  const { stage, summary, resourceIds } = await generateLearningPath(answers, resources, userId);

  const validIds = resourceIds.filter((id) => resources.some((r) => r.id === id));

  await db.$transaction(async (tx) => {
    await tx.onboardingResponse.upsert({
      where: { userId },
      create: { userId, answers, stage },
      update: { answers, stage },
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

  await trackServerEvent("onboarding_completed", userId, {
    ai_experience_level: answers.experience,
    primary_goal: answers.goal,
    path_stage: stage,
    resource_count: validIds.length,
  });

  validIds.forEach((resourceId) => {
    trackServerEvent("resource_assigned", userId, {
      resource_id: resourceId,
      resource_count: validIds.length,
      path_stage: stage,
    });
  });

  return NextResponse.json({ success: true });
}
