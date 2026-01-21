"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      setError("");
      const res = await fetch("/api/summary");
      if (!res.ok) {
        throw new Error("Failed to load summary");
      }
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError("Summary could not be loaded.");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    // Sayfa açılınca özet metrikleri çek
    fetchSummary();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus("");
    setError("");
    setLoadingUpload(true);

    try {
      const res = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setUploadStatus("Upload successful & data saved to DB.");
      // Upload başarılı → özet metrikleri yeniden çek
      await fetchSummary();
    } catch (err) {
      console.error(err);
      setUploadStatus("");
      setError("Error uploading file.");
    } finally {
      setLoadingUpload(false);
    }
  };

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="border-b pb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            InsightBridge – Analytics Demo
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Upload a CSV, store it in MySQL, and see aggregated metrics ready
            for AI insights.
          </p>
        </header>

        {/* Top section: Upload */}
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold">1. Upload CSV</h2>
          <p className="text-sm text-slate-600">
            Expected columns:{" "}
            <code className="bg-slate-100 px-1 rounded">
              date,sessions,users,conversions,revenue
            </code>
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-50"
            />
            <button
              onClick={handleUpload}
              disabled={!file || loadingUpload}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 disabled:bg-blue-300"
            >
              {loadingUpload ? "Uploading..." : "Upload CSV"}
            </button>
          </div>

          {uploadStatus && (
            <p className="text-sm text-emerald-600">{uploadStatus}</p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </section>

        {/* Summary + Daily Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">2. Dashboard</h2>
            <button
              onClick={fetchSummary}
              disabled={loadingSummary}
              className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-60"
            >
              {loadingSummary ? "Refreshing..." : "Refresh data"}
            </button>
          </div>

          {!summary && !loadingSummary && (
            <p className="text-sm text-slate-500">
              No data yet. Upload a CSV to see the dashboard.
            </p>
          )}

          {summary && (
            <div className="space-y-6">
              {/* Period cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Current period (last 7 days)
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-slate-500">Sessions</div>
                      <div className="font-medium">
                        {summary.current_period.sessions}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Users</div>
                      <div className="font-medium">
                        {summary.current_period.users}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Conversions</div>
                      <div className="font-medium">
                        {summary.current_period.conversions}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Conversion rate</div>
                      <div className="font-medium">
                        {formatPercent(
                          summary.current_period.conversion_rate || 0
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Previous period (7 days before)
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-slate-500">Sessions</div>
                      <div className="font-medium">
                        {summary.previous_period.sessions}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Users</div>
                      <div className="font-medium">
                        {summary.previous_period.users}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Conversions</div>
                      <div className="font-medium">
                        {summary.previous_period.conversions}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Conversion rate</div>
                      <div className="font-medium">
                        {formatPercent(
                          summary.previous_period.conversion_rate || 0
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily table */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Daily breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-left">
                        <th className="px-3 py-2 border-b">Date</th>
                        <th className="px-3 py-2 border-b">Sessions</th>
                        <th className="px-3 py-2 border-b">Users</th>
                        <th className="px-3 py-2 border-b">Conversions</th>
                        <th className="px-3 py-2 border-b">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.daily.map((row, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                          <td className="px-3 py-2 border-b">
                            {row.date?.toString().slice(0, 10)}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {row.sessions}
                          </td>
                          <td className="px-3 py-2 border-b">{row.users}</td>
                          <td className="px-3 py-2 border-b">
                            {row.conversions}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {row.revenue !== null ? row.revenue : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
