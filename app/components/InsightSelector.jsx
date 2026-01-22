"use client";

const INSIGHTS = [
  {
    id: "researchIntensity",
    label: "Research intensity over time",
    description: "How strongly users are engaging with your content over time.",
    requiredFields: ["date", "sessions"],
  },
  {
    id: "applicationMomentum",
    label: "Application momentum (week-over-week)",
    description:
      "Whether interest and intent are accelerating or slowing compared to the previous week.",
    requiredFields: ["date", "sessions"],
  },
  {
    id: "elasticity",
    label: "Elasticity (traffic → applications)",
    description:
      "How efficiently traffic turns into conversions or applications.",
    requiredFields: ["sessions", "conversions"],
  },
  {
    id: "divergenceIndex",
    label: "Divergence index",
    description:
      "When traffic and engagement move in different directions (e.g. more traffic, weaker intent).",
    requiredFields: ["sessions", "users"],
  },
];

function detectAvailableFields(daily) {
  const presence = {
    date: false,
    sessions: false,
    users: false,
    conversions: false,
    revenue: false,
  };

  daily.forEach((row) => {
    if (row.date) presence.date = true;
    if (row.sessions != null) presence.sessions = true;
    if (row.users != null) presence.users = true;
    if (row.conversions != null) presence.conversions = true;
    if (row.revenue != null) presence.revenue = true;
  });

  return Object.keys(presence).filter((key) => presence[key]);
}

export default function InsightSelector({
  daily,
  selectedInsights,
  onSelectedChange,
  onGenerate,
  generationStatus,
}) {
  if (!daily || daily.length === 0) return null;

  const availableFields = detectAvailableFields(daily);

  const availableInsights = INSIGHTS.filter((ins) =>
    ins.requiredFields.every((f) => availableFields.includes(f))
  );

  if (availableInsights.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-semibold mb-2">
          3. Available insights from this dataset
        </h3>
        <p className="text-sm text-slate-500">
          This dataset is too limited to generate standard insights. Try adding
          more columns like conversions or revenue.
        </p>
      </div>
    );
  }

  const toggleInsight = (id) => {
    if (selectedInsights.includes(id)) {
      onSelectedChange(selectedInsights.filter((x) => x !== id));
    } else {
      onSelectedChange([...selectedInsights, id]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold mb-1">
          3. With this data, you can generate the following insights:
        </h3>
        <p className="text-xs text-slate-500">
          Select one or more insight types. In the next step, we will ask the AI
          engine to generate explanations based on your selection.
        </p>
      </div>

      <div className="space-y-2">
        {availableInsights.map((insight) => (
          <label
            key={insight.id}
            className="flex items-start gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={selectedInsights.includes(insight.id)}
              onChange={() => toggleInsight(insight.id)}
            />
            <div>
              <div className="font-medium">{insight.label}</div>
              <div className="text-xs text-slate-500">
                {insight.description}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onGenerate}
          disabled={selectedInsights.length === 0}
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 disabled:bg-emerald-300"
        >
          Generate insights (next step)
        </button>
        {generationStatus && (
          <span className="text-xs text-slate-500">{generationStatus}</span>
        )}
      </div>
    </div>
  );
}
