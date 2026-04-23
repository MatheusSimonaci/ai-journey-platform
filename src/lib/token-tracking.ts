import { db } from "@/lib/db";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export async function logTokenUsage(
  userId: string,
  usage: TokenUsage,
  model: string,
  operation: string,
  status: string = "success",
  errorMessage?: string
) {
  const totalTokens = usage.inputTokens + usage.outputTokens;

  // @ts-ignore - TokenUsageLog model exists in schema, will be generated on deploy
  await db.tokenUsageLog.create({
    data: {
      userId,
      model,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      totalTokens,
      operation,
      status,
      errorMessage,
    },
  });

  // Update user's token budget tracking
  await updateUserTokenBudget(userId, totalTokens);
}

export async function updateUserTokenBudget(userId: string, tokensUsed: number) {
  const today = new Date().toDateString();
  const currentMonth = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0");

  // @ts-ignore - TokenBudget model exists in schema, will be generated on deploy
  let budget = await db.tokenBudget.findUnique({
    where: { userId },
  });

  if (!budget) {
    // Create default budget if it doesn't exist
    const monthlyLimit = parseInt(process.env.DEFAULT_MONTHLY_TOKEN_LIMIT || "1000000", 10);
    const dailyLimit = process.env.DEFAULT_DAILY_TOKEN_LIMIT ? parseInt(process.env.DEFAULT_DAILY_TOKEN_LIMIT, 10) : undefined;

    // @ts-ignore - TokenBudget model exists in schema, will be generated on deploy
    budget = await db.tokenBudget.create({
      data: {
        userId,
        monthlyLimitTokens: monthlyLimit,
        dailyLimitTokens: dailyLimit,
        lastResetMonth: new Date(),
        lastResetDay: new Date(),
      },
    });
  }

  // Check if we need to reset daily counter
  const lastResetDay = budget.lastResetDay.toDateString();
  const tokensUsedToday = lastResetDay === today ? budget.tokensUsedToday + tokensUsed : tokensUsed;

  // Check if we need to reset monthly counter
  const lastResetMonthStr = budget.lastResetMonth.getFullYear() + "-" + String(budget.lastResetMonth.getMonth() + 1).padStart(2, "0");
  const tokensUsedThisMonth = lastResetMonthStr === currentMonth ? budget.tokensUsedThisMonth + tokensUsed : tokensUsed;

  // @ts-ignore - TokenBudget model exists in schema, will be generated on deploy
  await db.tokenBudget.update({
    where: { userId },
    data: {
      tokensUsedToday,
      tokensUsedThisMonth,
      lastResetDay: lastResetDay !== today ? new Date() : undefined,
      lastResetMonth: lastResetMonthStr !== currentMonth ? new Date() : undefined,
    },
  });
}

export async function checkTokenBudget(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  // @ts-ignore - TokenBudget model exists in schema, will be generated on deploy
  const budget = await db.tokenBudget.findUnique({
    where: { userId },
  });

  if (!budget) {
    return { allowed: true };
  }

  // Check monthly limit
  if (budget.tokensUsedThisMonth >= budget.monthlyLimitTokens) {
    return {
      allowed: false,
      reason: `Monthly token limit (${budget.monthlyLimitTokens}) exceeded. Used: ${budget.tokensUsedThisMonth}`,
    };
  }

  // Check daily limit if set
  if (budget.dailyLimitTokens && budget.tokensUsedToday >= budget.dailyLimitTokens) {
    return {
      allowed: false,
      reason: `Daily token limit (${budget.dailyLimitTokens}) exceeded. Used: ${budget.tokensUsedToday}`,
    };
  }

  return { allowed: true };
}

export async function getTokenUsageStats(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // @ts-ignore - TokenUsageLog model exists in schema, will be generated on deploy
  const usage = await db.tokenUsageLog.groupBy({
    by: ["createdAt", "operation"],
    where: {
      userId,
      createdAt: {
        gte: startDate,
      },
    },
    _sum: {
      totalTokens: true,
      inputTokens: true,
      outputTokens: true,
    },
    _count: {
      id: true,
    },
  });

  return usage;
}

export async function getUserTokenBudget(userId: string) {
  // @ts-ignore - TokenBudget model exists in schema, will be generated on deploy
  return db.tokenBudget.findUnique({
    where: { userId },
  });
}
