"use client";

import { useEffect, useState } from "react";
import DailyTable from "./DailyTable";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    const res = await fetch("/api/summary");
    const data = await res.json();
    setSummary(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // CSV Upload sonrası refresh
  useEffect(() => {
    const handler = () => fetchSummary();
    window.addEventListener("data-updated", handler);
    return () => window.removeEventListener("data-updated", handler);
  }, []);

  const formatPercent = (v) => `${(v * 100).toFixed(2)}%`;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">2. Dashboard</h2>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}

      {!loading && !summary && (
        <p className="text-sm text-slate-500">Upload a CSV to continue.</p>
      )}

      {summary && (
        <div className="space-y-6">
          {/* Period Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs font-semibold text-slate-500">
                Current (Last 7 days)
              </p>
              <p>Sessions: {summary.current_period.sessions}</p>
              <p>Users: {summary.current_period.users}</p>
              <p>Conversions: {summary.current_period.conversions}</p>
              <p>
                Conv rate: {formatPercent(summary.current_period.conversion_rate)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs font-semibold text-slate-500">
                Previous (Prev 7 days)
              </p>
              <p>Sessions: {summary.previous_period.sessions}</p>
              <p>Users: {summary.previous_period.users}</p>
              <p>Conversions: {summary.previous_period.conversions}</p>
              <p>
                Conv rate: {formatPercent(summary.previous_period.conversion_rate)}
              </p>
            </div>
          </div>

          <DailyTable daily={summary.daily} />
        </div>
      )}
    </section>
  );
}
