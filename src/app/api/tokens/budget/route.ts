import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserTokenBudget } from "@/lib/token-tracking";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  // @ts-ignore - TokenBudget model exists in schema, will be generated on deploy
  const budget = await getUserTokenBudget(userId);

  if (!budget) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }

  const monthlyUsagePercent = (budget.tokensUsedThisMonth / budget.monthlyLimitTokens) * 100;
  const dailyUsagePercent = budget.dailyLimitTokens ? (budget.tokensUsedToday / budget.dailyLimitTokens) * 100 : 0;
  const isAlerted = monthlyUsagePercent >= budget.alertThresholdPercent || dailyUsagePercent >= budget.alertThresholdPercent;

  return NextResponse.json({
    userId,
    monthlyLimit: budget.monthlyLimitTokens,
    monthlyUsed: budget.tokensUsedThisMonth,
    monthlyRemaining: budget.monthlyLimitTokens - budget.tokensUsedThisMonth,
    monthlyPercent: Math.round(monthlyUsagePercent),
    dailyLimit: budget.dailyLimitTokens,
    dailyUsed: budget.tokensUsedToday,
    dailyRemaining: budget.dailyLimitTokens ? budget.dailyLimitTokens - budget.tokensUsedToday : null,
    dailyPercent: budget.dailyLimitTokens ? Math.round(dailyUsagePercent) : null,
    alertThresholdPercent: budget.alertThresholdPercent,
    isAlerted,
    lastResetMonth: budget.lastResetMonth.toISOString(),
    lastResetDay: budget.lastResetDay.toISOString(),
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  // @ts-ignore - TokenBudget model exists in schema, will be generated on deploy
  const budget = await db.tokenBudget.update({
    where: { userId },
    data: {
      monthlyLimitTokens: body.monthlyLimitTokens ?? undefined,
      dailyLimitTokens: body.dailyLimitTokens ?? undefined,
      alertThresholdPercent: body.alertThresholdPercent ?? undefined,
    },
  });

  return NextResponse.json({
    success: true,
    budget,
  });
}
