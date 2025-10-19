// Simple linear regression for trend prediction
export const calculateTrendLine = (data: { x: number; y: number }[]) => {
  if (data.length < 2) return null;

  const n = data.length;
  const sumX = data.reduce((sum, point) => sum + point.x, 0);
  const sumY = data.reduce((sum, point) => sum + point.y, 0);
  const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

export const predictFutureValues = (
  historicalData: { x: number; y: number }[],
  futureDays: number = 3
) => {
  const trend = calculateTrendLine(historicalData);
  if (!trend) return [];

  const lastX = historicalData[historicalData.length - 1]?.x || 0;
  const predictions = [];

  for (let i = 1; i <= futureDays; i++) {
    const x = lastX + i;
    const y = trend.slope * x + trend.intercept;
    predictions.push({ x, y: Math.max(0, y) }); // Ensure non-negative values
  }

  return predictions;
};
