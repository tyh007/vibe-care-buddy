import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { predictFutureValues } from "@/utils/trendPrediction";
import { Activity, Moon, Dumbbell, Droplets, Smartphone } from "lucide-react";

interface ChartData {
  date: string;
  value: number;
  isPrediction?: boolean;
  dayIndex: number;
}

export const MetricsCharts = () => {
  const [moodData, setMoodData] = useState<ChartData[]>([]);
  const [sleepData, setSleepData] = useState<ChartData[]>([]);
  const [exerciseData, setExerciseData] = useState<ChartData[]>([]);
  const [waterData, setWaterData] = useState<ChartData[]>([]);
  const [screenTimeData, setScreenTimeData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Load and process mood data
    const moodEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    const processedMood = processMoodData(moodEntries);
    setMoodData(processedMood);

    // Load and process health data
    const healthEntries = JSON.parse(localStorage.getItem("healthEntries") || "[]");
    setSleepData(processHealthMetric(healthEntries, "sleep"));
    setExerciseData(processHealthMetric(healthEntries, "exercise"));
    setWaterData(processHealthMetric(healthEntries, "water"));

    // Load and process screen time data
    const screenTimeEntries = JSON.parse(localStorage.getItem("screenTimeEntries") || "[]");
    setScreenTimeData(processScreenTimeData(screenTimeEntries));
  }, []);

  const processMoodData = (entries: any[]): ChartData[] => {
    const last7Days = entries.slice(0, 14).reverse();
    const historicalData = last7Days.slice(0, 7).map((entry, idx) => ({
      date: new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: entry.mood,
      dayIndex: idx,
    }));

    // Calculate predictions
    const trendData = historicalData.map((d, idx) => ({ x: idx, y: d.value }));
    const predictions = predictFutureValues(trendData, 3);

    const predictionData = predictions.map((pred, idx) => ({
      date: `Day +${idx + 1}`,
      value: Math.min(5, Math.max(1, pred.y)),
      isPrediction: true,
      dayIndex: historicalData.length + idx,
    }));

    return [...historicalData, ...predictionData];
  };

  const processHealthMetric = (entries: any[], metric: string): ChartData[] => {
    const last7Days = entries.slice(0, 14).reverse();
    const historicalData = last7Days.slice(0, 7)
      .filter((entry) => entry[metric])
      .map((entry, idx) => ({
        date: new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: parseFloat(entry[metric]),
        dayIndex: idx,
      }));

    if (historicalData.length < 2) return historicalData;

    const trendData = historicalData.map((d, idx) => ({ x: idx, y: d.value }));
    const predictions = predictFutureValues(trendData, 3);

    const predictionData = predictions.map((pred, idx) => ({
      date: `Day +${idx + 1}`,
      value: pred.y,
      isPrediction: true,
      dayIndex: historicalData.length + idx,
    }));

    return [...historicalData, ...predictionData];
  };

  const processScreenTimeData = (entries: any[]): ChartData[] => {
    const last7Days = entries.slice(0, 14).reverse();
    const historicalData = last7Days.slice(0, 7).map((entry, idx) => ({
      date: new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: entry.totalMinutes / 60, // Convert to hours
      dayIndex: idx,
    }));

    if (historicalData.length < 2) return historicalData;

    const trendData = historicalData.map((d, idx) => ({ x: idx, y: d.value }));
    const predictions = predictFutureValues(trendData, 3);

    const predictionData = predictions.map((pred, idx) => ({
      date: `Day +${idx + 1}`,
      value: Math.max(0, pred.y),
      isPrediction: true,
      dayIndex: historicalData.length + idx,
    }));

    return [...historicalData, ...predictionData];
  };

  const renderChart = (
    data: ChartData[],
    title: string,
    icon: any,
    color: string,
    unit: string
  ) => {
    if (data.length === 0) {
      return (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-muted-foreground text-center py-8">
            No data yet. Start tracking to see trends!
          </p>
        </Card>
      );
    }

    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, title]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                return payload.isPrediction ? (
                  <circle cx={cx} cy={cy} r={4} fill={color} opacity={0.5} />
                ) : (
                  <circle cx={cx} cy={cy} r={4} fill={color} />
                );
              }}
              name={title}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Dashed line shows predicted trend based on recent data
        </p>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Metrics Trends & Predictions</h2>
        <p className="text-muted-foreground">
          Track your metrics over time with AI-powered trend predictions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderChart(
          moodData,
          "Mood Score",
          <Activity className="w-5 h-5 text-primary" />,
          "hsl(var(--primary))",
          ""
        )}
        {renderChart(
          sleepData,
          "Sleep Duration",
          <Moon className="w-5 h-5 text-blue-500" />,
          "#3b82f6",
          "hrs"
        )}
        {renderChart(
          exerciseData,
          "Exercise Time",
          <Dumbbell className="w-5 h-5 text-green-500" />,
          "#22c55e",
          "min"
        )}
        {renderChart(
          waterData,
          "Water Intake",
          <Droplets className="w-5 h-5 text-cyan-500" />,
          "#06b6d4",
          "glasses"
        )}
        {renderChart(
          screenTimeData,
          "Screen Time",
          <Smartphone className="w-5 h-5 text-orange-500" />,
          "#f97316",
          "hrs"
        )}
      </div>
    </div>
  );
};
