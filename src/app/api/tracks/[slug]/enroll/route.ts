import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackServerEvent } from "@/lib/server-events";

export async function POST(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const track = await db.track.findUnique({ where: { slug: params.slug } });
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  const enrollment = await db.trackEnrollment.upsert({
    where: { trackId_userId: { trackId: track.id, userId: session.user.id } },
    create: { trackId: track.id, userId: session.user.id },
    update: {},
  });

  await trackServerEvent("track_enrolled", session.user.id, {
    track_slug: track.slug,
    track_domain: track.domain,
  });

  return NextResponse.json({ enrollment });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const track = await db.track.findUnique({ where: { slug: params.slug } });
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  await db.trackEnrollment.deleteMany({
    where: { trackId: track.id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
