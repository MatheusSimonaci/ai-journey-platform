import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const daysParam = req.nextUrl.searchParams.get("days") || "30";
  const days = Math.min(Math.max(parseInt(daysParam), 1), 365);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // @ts-ignore - TokenUsageLog model exists in schema, will be generated on deploy
  const logs = await db.tokenUsageLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalTokens = logs.reduce((sum, log) => sum + log.totalTokens, 0);
  const totalInputTokens = logs.reduce((sum, log) => sum + log.inputTokens, 0);
  const totalOutputTokens = logs.reduce((sum, log) => sum + log.outputTokens, 0);

  const byOperation: Record<string, { count: number; tokens: number }> = {};
  logs.forEach((log: any) => {
    if (!byOperation[log.operation]) {
      byOperation[log.operation] = { count: 0, tokens: 0 };
    }
    byOperation[log.operation].count += 1;
    byOperation[log.operation].tokens += log.totalTokens;
  });

  const byModel: Record<string, { count: number; tokens: number }> = {};
  logs.forEach((log: any) => {
    if (!byModel[log.model]) {
      byModel[log.model] = { count: 0, tokens: 0 };
    }
    byModel[log.model].count += 1;
    byModel[log.model].tokens += log.totalTokens;
  });

  return NextResponse.json({
    period: {
      days,
      from: startDate.toISOString(),
      to: new Date().toISOString(),
    },
    summary: {
      totalRequests: logs.length,
      totalTokens,
      totalInputTokens,
      totalOutputTokens,
      averageTokensPerRequest: logs.length > 0 ? Math.round(totalTokens / logs.length) : 0,
    },
    byOperation,
    byModel,
    logs: logs.slice(0, 100),
  });
}
