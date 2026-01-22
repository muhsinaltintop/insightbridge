export function summarizeMetric(data) {
  const clean = data.filter(d => d.value !== null);

  if (clean.length < 2) {
    return {
      trend: "Not enough data",
      direction: "flat",
    };
  }

  const first = clean[0].value;
  const last = clean[clean.length - 1].value;

  const change = last - first;
  const pctChange = first !== 0 ? (change / first) * 100 : 0;

  let direction = "flat";
  if (pctChange > 1) direction = "up";
  if (pctChange < -1) direction = "down";

  return {
    first,
    last,
    pctChange,
    direction,
  };
}
