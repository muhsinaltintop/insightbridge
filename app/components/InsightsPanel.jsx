"use client";

import MetricLineChart from "./MetricLineChart";
import { summarizeMetric } from "@/lib/insightUtils";

export default function InsightsPanel({ derivedMetrics }) {
  if (!derivedMetrics || derivedMetrics.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-white text-sm text-slate-500">
        No insights generated yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="text-base font-semibold">Insights</h3>

      {derivedMetrics.map((m) => {
        const summary = summarizeMetric(m.data);

        return (
          <div
            key={m.id}
            className="p-4 rounded-lg border border-slate-200 space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="font-medium text-slate-800">
                {m.label}
              </div>

              {summary.direction !== "flat" && (
                <span
                  className={`text-sm font-medium
                    ${summary.direction === "up"
                      ? "text-emerald-600"
                      : "text-rose-600"
                    }`}
                >
                  {summary.direction === "up" ? "↑" : "↓"}{" "}
                  {summary.pctChange.toFixed(1)}%
                </span>
              )}
            </div>

            {/* Chart */}
            <MetricLineChart data={m.data} />

            {/* Summary text */}
            <p className="text-sm text-slate-600">
              Latest value:{" "}
              <span className="font-medium">
                {summary.last?.toFixed(3)}
              </span>
            </p>

            {/* Mini table */}
            <div className="text-xs text-slate-500">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th>Date</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {m.data.slice(-3).map((d) => (
                    <tr key={d.date}>
                      <td>{new Date(d.date).toLocaleDateString()}</td>
                      <td>{d.value?.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
