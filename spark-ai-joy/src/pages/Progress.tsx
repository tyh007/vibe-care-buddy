import { MoodChart } from "@/components/MoodChart";
import { MetricsCharts } from "@/components/MetricsCharts";
import { Card } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const ProgressPage = () => {
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [insights, setInsights] = useState({
    mostCommonMood: "N/A",
    improvementTrend: "N/A",
  });

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    
    if (entries.length > 0) {
      // Calculate weekly progress
      const uniqueDays = new Set(
        entries.map((e: any) => new Date(e.timestamp).toDateString())
      ).size;
      setWeeklyProgress(Math.min(100, (uniqueDays / 7) * 100));

      // Calculate most common mood
      const moodCounts: { [key: number]: number } = {};
      entries.forEach((e: any) => {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      });
      const mostCommon = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
      const moodLabels: { [key: string]: string } = {
        "5": "Great",
        "4": "Good",
        "3": "Okay",
        "2": "Down",
        "1": "Sad",
      };
      setInsights((prev) => ({
        ...prev,
        mostCommonMood: moodLabels[mostCommon[0]],
      }));

      // Calculate trend
      if (entries.length >= 2) {
        const recent = entries.slice(0, 3).reduce((sum: number, e: any) => sum + e.mood, 0) / 3;
        const older = entries.slice(-3).reduce((sum: number, e: any) => sum + e.mood, 0) / 3;
        const trend = recent > older ? "Improving" : recent < older ? "Declining" : "Stable";
        setInsights((prev) => ({ ...prev, improvementTrend: trend }));
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 animate-fade-in">Your Progress</h1>
          <p className="text-lg text-muted-foreground animate-fade-in">
            Track your emotional wellness journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-2">Weekly Goal</h3>
            <p className="text-3xl font-bold mb-4">{Math.round(weeklyProgress)}%</p>
            <ProgressBar value={weeklyProgress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              Track your mood 7 days in a row
            </p>
          </Card>

          <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h3 className="text-lg font-semibold mb-2">Most Common Mood</h3>
            <p className="text-3xl font-bold">{insights.mostCommonMood}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on your recent entries
            </p>
          </Card>

          <Card className="p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h3 className="text-lg font-semibold mb-2">Trend</h3>
            <p className="text-3xl font-bold">{insights.improvementTrend}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Compared to earlier entries
            </p>
          </Card>
        </div>

        <MoodChart />

        <MetricsCharts />

        <Card className="p-6 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4">Keep Going!</h3>
          <p className="text-muted-foreground mb-4">
            Regular mood tracking helps you understand patterns and improve your emotional
            awareness. Here are some tips:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Track your mood at the same time each day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Add notes to remember what influenced your mood</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Use the AI chat when you need support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Celebrate small improvements in your mood trends</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
