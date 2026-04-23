"use client";

import { useEffect, useState } from "react";

interface TokenBudget {
  monthlyLimit: number;
  monthlyUsed: number;
  monthlyRemaining: number;
  monthlyPercent: number;
  dailyLimit?: number;
  dailyUsed: number;
  dailyRemaining?: number;
  dailyPercent?: number;
  alertThresholdPercent: number;
  isAlerted: boolean;
}

interface TokenStats {
  period: {
    days: number;
    from: string;
    to: string;
  };
  summary: {
    totalRequests: number;
    totalTokens: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    averageTokensPerRequest: number;
  };
}

export function TokenUsageDashboard() {
  const [budget, setBudget] = useState<TokenBudget | null>(null);
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/tokens/budget").then((r) => r.json()),
      fetch("/api/tokens/usage?days=30").then((r) => r.json()),
    ]).then(([budgetData, statsData]) => {
      if (budgetData.error) {
        setError(budgetData.error);
      } else {
        setBudget(budgetData);
      }
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center">Loading token usage...</div>;
  }

  if (error) {
    return <div className="rounded bg-red-100 p-4 text-red-800">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Monthly Budget */}
      {budget && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold">Monthly Token Budget</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Used</span>
              <span className="font-mono">{budget.monthlyUsed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Limit</span>
              <span className="font-mono">{budget.monthlyLimit.toLocaleString()}</span>
            </div>
            <div className="mt-4">
              <div className="h-3 rounded-full bg-gray-200">
                <div
                  className={`h-3 rounded-full transition-all ${
                    budget.monthlyPercent >= 100
                      ? "bg-red-500"
                      : budget.monthlyPercent >= budget.alertThresholdPercent
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(budget.monthlyPercent, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-gray-600">{budget.monthlyPercent}% used</div>
            </div>
            {budget.isAlerted && (
              <div className="mt-4 rounded bg-yellow-100 p-3 text-sm text-yellow-800">
                ⚠️ Token usage approaching limit
              </div>
            )}
          </div>
        </div>
      )}

      {/* Daily Budget */}
      {budget && budget.dailyLimit && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold">Daily Token Budget</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Used Today</span>
              <span className="font-mono">{budget.dailyUsed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Limit</span>
              <span className="font-mono">{budget.dailyLimit.toLocaleString()}</span>
            </div>
            <div className="mt-4">
              <div className="h-3 rounded-full bg-gray-200">
                <div
                  className={`h-3 rounded-full transition-all ${
                    (budget.dailyPercent || 0) >= 100
                      ? "bg-red-500"
                      : (budget.dailyPercent || 0) >= budget.alertThresholdPercent
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min(budget.dailyPercent || 0, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-gray-600">{budget.dailyPercent}% used</div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Statistics */}
      {stats && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold">Usage Statistics (Last {stats.period.days} days)</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="text-sm text-gray-600">Requests</div>
              <div className="text-2xl font-bold">{stats.summary.totalRequests}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Tokens</div>
              <div className="text-2xl font-bold">{stats.summary.totalTokens.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Input Tokens</div>
              <div className="text-2xl font-bold">{stats.summary.totalInputTokens.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Output Tokens</div>
              <div className="text-2xl font-bold">{stats.summary.totalOutputTokens.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-4 rounded bg-gray-50 p-3">
            <div className="text-sm text-gray-600">Average per Request</div>
            <div className="text-lg font-semibold">{stats.summary.averageTokensPerRequest.toLocaleString()} tokens</div>
          </div>
        </div>
      )}
    </div>
  );
}
