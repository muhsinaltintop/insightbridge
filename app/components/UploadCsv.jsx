"use client";

import { useState } from "react";

export default function UploadCsv() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-csv", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setStatus("Uploaded and saved to DB.");
      // Component kendi event'ini trigger eder → Dashboard refresher
      window.dispatchEvent(new Event("data-updated"));
    } else {
      setStatus("Upload error.");
    }

    setLoading(false);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-semibold">1. Upload CSV</h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded text-sm"
      />

      <button
        disabled={!file || loading}
        onClick={handleUpload}
        className="px-4 py-2 text-sm rounded bg-blue-600 text-white disabled:bg-blue-300"
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {status && <p className="text-sm text-slate-700">{status}</p>}
    </section>
  );
}
