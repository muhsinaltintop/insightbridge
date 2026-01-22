"use client";

export default function Metrics({
  availableMetrics,
  selected,
  onToggle,
}) {
  if (!availableMetrics || availableMetrics.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-white">
        <p className="text-sm text-slate-500">
          No derived metrics available for this dataset.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white space-y-3">
      <h3 className="text-base font-semibold">Available Derived Metrics</h3>

      <p className="text-sm text-slate-600">
        Based on the columns in your dataset, these metrics can be computed.
      </p>

      <div className="space-y-2">
        {availableMetrics.map((metric) => (
          <label
            key={metric.id}
            className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(metric.id)}
              onChange={() => onToggle(metric.id)}
              className="mt-1"
            />
            <div className="flex flex-col">
              <span className="font-medium text-slate-800">
                {metric.label}
              </span>
              <span className="text-xs text-slate-500">
                {metric.explanation}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
