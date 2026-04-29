import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import KnowledgeClient from "./KnowledgeClient";

export const metadata = { title: "Base de Conhecimento" };

export default async function KnowledgePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const entries = await db.knowledgeEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { socialExports: true } } },
  });

  return (
    <KnowledgeClient
      initialEntries={entries.map((e) => ({
        ...e,
        url: e.url ?? null,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      }))}
      userName={session.user.name ?? session.user.email ?? ""}
    />
  );
}
