"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MetricLineChart({ data }) {
  if (!data || data.length === 0) return null;

  const cleaned = data
    .filter(d => d.value !== null)
    .map(d => ({
      ...d,
      dateLabel: new Date(d.date).toLocaleDateString(),
    }));

  if (cleaned.length < 2) return null;

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={cleaned}>
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 10 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
            width={40}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
