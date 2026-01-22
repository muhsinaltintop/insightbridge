// lib/metrics.js

// MVP-1: Metric + kısa explanation
export const metricRules = {
  researchIntensity: {
    label: "Research Intensity",
    explanation: "sessions ÷ users",
    needs: ["sessions", "users"],
  },
  applicationConversionRate: {
    label: "Application Conversion Rate",
    explanation: "conversions ÷ sessions",
    needs: ["sessions", "conversions"],
  },
  considerationToApplication: {
    label: "Consideration → Application",
    explanation: "conversions ÷ users",
    needs: ["users", "conversions"],
  },
  elasticity: {
    label: "Elasticity (Traffic → Applications)",
    explanation: "%Δapplications ÷ %Δsessions (requires ≥14 days)",
    needs: ["sessions", "conversions"],
    needsWindow: 14,
  },
  divergenceIndex: {
    label: "Divergence Index",
    explanation: "interest_growth – application_growth (requires ≥14 days)",
    needs: ["sessions", "conversions"],
    needsWindow: 14,
  },
  revenuePerApplication: {
    label: "Revenue per Application",
    explanation: "revenue ÷ conversions",
    needs: ["revenue", "conversions"],
  },
  revenuePerUser: {
    label: "Revenue per User",
    explanation: "revenue ÷ users",
    needs: ["revenue", "users"],
  },
  revenuePerSession: {
    label: "Revenue per Session",
    explanation: "revenue ÷ sessions",
    needs: ["revenue", "sessions"],
  },
};

// columns: ["sessions","users","conversions","revenue"]
// days: summary.daily.length
export function detectPossibleMetrics(columns, days) {
  return Object.entries(metricRules)
    .filter(([_, rule]) => {
      const hasCols = rule.needs.every((col) => columns.includes(col));
      const hasWindow = !rule.needsWindow || days >= rule.needsWindow;
      return hasCols && hasWindow;
    })
    .map(([id, rule]) => ({
      id,
      label: rule.label,
      explanation: rule.explanation,
    }));
}
