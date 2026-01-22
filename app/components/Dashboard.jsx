"use client";
import { useEffect, useState } from "react";
import DailyTable from "./DailyTable";
import InsightSelector from "./InsightSelector";
import { computeDerivedMetric } from "@/lib/computeMetrics";
import InsightsPanel from "./InsightsPanel";
import Metrics from "./Metrics";
import { detectPossibleMetrics } from "@/lib/metrics";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedInsights, setSelectedInsights] = useState([]);
  const [generationStatus, setGenerationStatus] = useState("");
  const [derivedMetrics, setDerivedMetrics] = useState([]);
  const [availableMetrics, setAvailableMetrics] = useState([]);
  const [selectedMetricIds, setSelectedMetricIds] = useState([]);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (!summary || !summary.daily || summary.daily.length === 0) {
      setAvailableMetrics([]);
      setSelectedMetricIds([]);
      return;
    }

    const firstRow = summary.daily[0];
    const columns = Object.keys(firstRow);
    const days = summary.daily.length;

    const metrics = detectPossibleMetrics(columns, days);

    setAvailableMetrics(metrics);
    setSelectedMetricIds([]); // ⬅️ default: nothing selected
  }, [summary]);

  let derived = [];

  if (summary && summary.daily && selectedMetricIds.length > 0) {
    derived = selectedMetricIds.map((id) => ({
      id,
      label: availableMetrics.find((m) => m.id === id)?.label,
      data: computeDerivedMetric(id, summary.daily),
    }));
  }

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/summary");
      if (!res.ok) {
        throw new Error("Failed to load summary");
      }
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching summary...");
    fetchSummary();
  }, []);

  // CSV Upload sonrası refresh
  useEffect(() => {
    const handler = () => fetchSummary();
    window.addEventListener("data-updated", handler);
    return () => window.removeEventListener("data-updated", handler);
  }, []);

  const formatPercent = (v) => `${(v * 100).toFixed(2)}%`;

  const handleGenerateInsights = () => {
    // Şimdilik sadece bir placeholder.
    // Sonraki adımda burada /api/ai-insight endpoint’ine istek atacağız.
    console.log("Selected insights:", selectedInsights);
    setGenerationStatus(
      `Generate clicked for: ${selectedInsights.join(", ")} (AI wiring comes next)`,
    );
  };

  useEffect(() => {
    if (!hasGenerated) return;
    if (!summary || !summary.daily) return;
    if (!selectedMetricIds || selectedMetricIds.length === 0) return;

    const derived = selectedMetricIds
      .filter((id) => availableMetrics.find((m) => m.id === id)?.available)
      .map((id) => ({
        id,
        label: availableMetrics.find((m) => m.id === id)?.label,
        data: computeDerivedMetric(id, summary.daily),
      }));

    setDerivedMetrics(derived);
  }, [hasGenerated, summary, selectedMetricIds]);

  console.log("summary:", summary);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">2. Dashboard</h2>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh data"}
        </button>
      </div>

      {loading && !summary && (
        <p className="text-sm text-slate-500">Loading...</p>
      )}

      {!loading && !summary && (
        <p className="text-sm text-slate-500">
          No data yet. Upload a CSV to see the dashboard.
        </p>
      )}

      {summary && (
        <div className="space-y-6">
          {/* Period cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Current period (last 7 days)
              </p>
              <p className="text-sm">
                Sessions:{" "}
                <span className="font-medium">
                  {summary.current_period.sessions}
                </span>
              </p>
              <p className="text-sm">
                Users:{" "}
                <span className="font-medium">
                  {summary.current_period.users}
                </span>
              </p>
              <p className="text-sm">
                Conversions:{" "}
                <span className="font-medium">
                  {summary.current_period.conversions}
                </span>
              </p>
              <p className="text-sm">
                Conversion rate:{" "}
                <span className="font-medium">
                  {formatPercent(summary.current_period.conversion_rate || 0)}
                </span>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Previous period (7 days before)
              </p>
              <p className="text-sm">
                Sessions:{" "}
                <span className="font-medium">
                  {summary.previous_period.sessions}
                </span>
              </p>
              <p className="text-sm">
                Users:{" "}
                <span className="font-medium">
                  {summary.previous_period.users}
                </span>
              </p>
              <p className="text-sm">
                Conversions:{" "}
                <span className="font-medium">
                  {summary.previous_period.conversions}
                </span>
              </p>
              <p className="text-sm">
                Conversion rate:{" "}
                <span className="font-medium">
                  {formatPercent(summary.previous_period.conversion_rate || 0)}
                </span>
              </p>
            </div>
          </div>

          {/* Daily table */}
          <DailyTable daily={summary.daily} />
          <Metrics
            availableMetrics={availableMetrics}
            selected={selectedMetricIds}
            onToggle={(id) => {
              setSelectedMetricIds((prev) =>
                prev.includes(id)
                  ? prev.filter((x) => x !== id)
                  : [...prev, id],
              );
              setHasGenerated(false); // ⬅️ seçim değişti, sonuç artık geçersiz
            }}
            onGenerate={() => {
              setHasGenerated(true); // ⬅️ artık üret
            }}
          />

          {hasGenerated && <InsightsPanel derivedMetrics={derivedMetrics} />}
        </div>
      )}
    </section>
  );
}
