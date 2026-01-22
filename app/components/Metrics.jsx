"use client";

export default function Metrics({
  availableMetrics,
  selected,
  onToggle,
  onGenerate,
}) {
  if (!availableMetrics || availableMetrics.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-white">
        <p className="text-sm text-slate-500">
          No insights can be generated from this dataset yet.
        </p>
      </div>
    );
  }

  const selectableCount = availableMetrics.filter(m => m.available).length;

  return (
    <div className="p-4 border rounded-lg bg-white space-y-4">
      <div>
        <h3 className="text-base font-semibold">
          What insights can this data give you?
        </h3>
        <p className="text-sm text-slate-600">
          Choose what you want to analyse. Only options supported by your data
          can be selected.
        </p>
      </div>

      <div className="space-y-2">
        {availableMetrics.map((metric) => {
          const disabled = !metric.available;

          return (
            <label
              key={metric.id}
              className={`flex items-start gap-2 p-3 rounded-lg border
                ${disabled
                  ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                  : "border-slate-200 hover:bg-slate-50 cursor-pointer"
                }`}
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={selected.includes(metric.id)}
                onChange={() => onToggle(metric.id)}
                className="mt-1"
              />

              <div className="flex flex-col gap-1">
                <span className="font-medium text-slate-800">
                  {metric.label}
                </span>

                <span className="text-xs text-slate-600">
                  {metric.description}
                </span>

                {disabled && (
                  <span className="text-xs text-amber-600">
                    ⚠ {metric.reason}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Generate button */}
      <div className="pt-3 border-t">
        <button
          onClick={onGenerate}
          disabled={selected.length === 0}
          className={`w-full py-2 rounded-md text-sm font-medium
            ${selected.length === 0
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
        >
          Generate insights
        </button>

        {selected.length === 0 && selectableCount > 0 && (
          <p className="text-xs text-slate-500 mt-2">
            Select at least one insight to continue.
          </p>
        )}
      </div>
    </div>
  );
}
