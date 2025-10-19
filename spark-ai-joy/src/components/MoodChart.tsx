import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const MoodChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    
    // Get last 7 entries and reverse for chronological order
    const recentEntries = entries.slice(0, 7).reverse();
    
    const data = recentEntries.map((entry: any, index: number) => ({
      name: new Date(entry.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      mood: entry.mood,
    }));

    setChartData(data);
  }, []);

  if (chartData.length === 0) {
    return (
      <Card className="p-6 animate-fade-in">
        <h3 className="text-xl font-semibold mb-4">Mood Trends</h3>
        <p className="text-muted-foreground text-center py-8">
          Start tracking your mood to see trends here
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">Mood Trends</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
          <YAxis domain={[0, 5]} stroke="hsl(var(--foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
