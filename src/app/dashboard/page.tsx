import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const path = await db.learningPath.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { resource: true },
      },
    },
  });

  if (!path) redirect("/onboarding");

  const progress = await db.userProgress.findMany({
    where: { userId: session.user.id },
  });

  const progressMap = Object.fromEntries(progress.map((p) => [p.resourceId, p.status]));

  const items = path.items.map((item) => ({
    id: item.resource.id,
    title: item.resource.title,
    url: item.resource.url,
    type: item.resource.type,
    stages: item.resource.stages,
    tags: item.resource.tags,
    description: item.resource.description,
    order: item.order,
    status: progressMap[item.resource.id] ?? "not_started",
  }));

  const completed = items.filter((i) => i.status === "completed").length;

  return (
    <DashboardClient
      userName={session.user.name ?? session.user.email ?? ""}
      stage={path.stage}
      summary={path.summary}
      items={items}
      completedCount={completed}
    />
  );
}
