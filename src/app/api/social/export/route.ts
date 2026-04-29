import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatForPlatform } from "@/lib/social-formats";
import { z } from "zod";

const ExportSchema = z.object({
  knowledgeEntryId: z.string().min(1),
  platform: z.enum(["linkedin", "twitter", "instagram"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = ExportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { knowledgeEntryId, platform } = parsed.data;

  const entry = await db.knowledgeEntry.findFirst({
    where: { id: knowledgeEntryId, userId: session.user.id },
  });

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formatted = formatForPlatform(
    platform,
    entry.title,
    entry.body,
    entry.url ?? undefined,
    entry.tags
  );

  const socialExport = await db.socialExport.create({
    data: {
      knowledgeEntryId: entry.id,
      platform,
      formattedContent: formatted.content as object,
      status: "draft",
    },
  });

  return NextResponse.json({ ...socialExport, formatted });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { exportId, status } = body as { exportId: string; status: string };

  if (!exportId || !["draft", "copied", "posted"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updated = await db.socialExport.updateMany({
    where: {
      id: exportId,
      knowledgeEntry: { userId: session.user.id },
    },
    data: { status },
  });

  return NextResponse.json({ updated: updated.count });
}
