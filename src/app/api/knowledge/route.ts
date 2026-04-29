import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const CreateSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
  url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).max(10).default([]),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await db.knowledgeEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { socialExports: true } },
    },
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, body: entryBody, url, tags } = parsed.data;

  const entry = await db.knowledgeEntry.create({
    data: {
      userId: session.user.id,
      title,
      body: entryBody,
      url: url || null,
      tags,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
