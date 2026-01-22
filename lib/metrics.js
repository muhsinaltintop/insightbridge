// lib/metrics.js

export const metricRules = {
  researchIntensity: {
    label: "User Engagement Intensity",
    description:
      "Shows how actively users explore your site. Higher values mean users generate more sessions on average.",
    needs: ["sessions", "users"],
  },

  applicationConversionRate: {
    label: "Conversion Rate",
    description:
      "Shows what percentage of visits result in a conversion. Helps you understand overall performance.",
    needs: ["sessions", "conversions"],
  },

  considerationToApplication: {
    label: "User → Conversion Rate",
    description:
      "Shows how many users actually convert. Useful when sessions per user vary.",
    needs: ["users", "conversions"],
  },

  elasticity: {
    label: "Traffic Sensitivity",
    description:
      "Shows whether increases in traffic lead to proportional increases in conversions. Requires at least 14 days of data.",
    needs: ["sessions", "conversions"],
    needsWindow: 14,
  },

  divergenceIndex: {
    label: "Interest vs Conversion Gap",
    description:
      "Detects whether user interest is growing faster than conversions. Requires trend data (14+ days).",
    needs: ["sessions", "conversions"],
    needsWindow: 14,
  },

  revenuePerApplication: {
    label: "Revenue per Conversion",
    description:
      "Shows how much revenue each conversion generates on average.",
    needs: ["revenue", "conversions"],
  },

  revenuePerUser: {
    label: "Revenue per User",
    description:
      "Shows how valuable each user is in revenue terms.",
    needs: ["revenue", "users"],
  },

  revenuePerSession: {
    label: "Revenue per Visit",
    description:
      "Shows how much revenue each session generates on average.",
    needs: ["revenue", "sessions"],
  },
};

export function detectPossibleMetrics(columns, days) {
  return Object.entries(metricRules).map(([id, rule]) => {
    const missingCols = rule.needs.filter(col => !columns.includes(col));
    const insufficientWindow =
      rule.needsWindow && days < rule.needsWindow;

    const isAvailable = missingCols.length === 0 && !insufficientWindow;

    return {
      id,
      label: rule.label,
      description: rule.description,
      available: isAvailable,
      reason: !isAvailable
        ? insufficientWindow
          ? `Requires at least ${rule.needsWindow} days of data`
          : `Missing data: ${missingCols.join(", ")}`
        : null,
    };
  });
}
