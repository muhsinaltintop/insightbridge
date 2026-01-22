export function computeDerivedMetric(metricId, daily) {
  switch (metricId) {
    case "researchIntensity":
      return daily.map(d => ({
        date: d.date,
        value: d.sessions && d.users ? d.sessions / d.users : null
      }));

    case "applicationConversionRate":
      return daily.map(d => ({
        date: d.date,
        value: d.sessions ? d.conversions / d.sessions : null
      }));

    case "considerationToApplication":
      return daily.map(d => ({
        date: d.date,
        value: d.users ? d.conversions / d.users : null
      }));

    case "revenuePerApplication":
      return daily.map(d => ({
        date: d.date,
        value: d.conversions ? d.revenue / d.conversions : null
      }));

    case "revenuePerUser":
      return daily.map(d => ({
        date: d.date,
        value: d.users ? d.revenue / d.users : null
      }));

    default:
      return [];
  }
}
