import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Smile, Target } from "lucide-react";

export const StatsCards = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    averageMood: 0,
    weeklyGoal: 0,
  });

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    
    const total = entries.length;
    const avgMood = total > 0
      ? (entries.reduce((sum: number, e: any) => sum + e.mood, 0) / total).toFixed(1)
      : 0;
    
    // Calculate streak (days with entries)
    const uniqueDays = new Set(
      entries.map((e: any) => new Date(e.timestamp).toDateString())
    ).size;

    setStats({
      totalEntries: total,
      currentStreak: uniqueDays,
      averageMood: Number(avgMood),
      weeklyGoal: Math.min(100, (uniqueDays / 7) * 100),
    });
  }, []);

  const cards = [
    {
      title: "Total Check-ins",
      value: stats.totalEntries,
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Average Mood",
      value: `${stats.averageMood}/5`,
      icon: Smile,
      color: "text-yellow-500",
    },
    {
      title: "Weekly Goal",
      value: `${Math.round(stats.weeklyGoal)}%`,
      icon: Target,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="glass border border-border/50 p-6 animate-fade-in hover-lift cursor-pointer transition-all"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color.replace('text-', 'bg-')}/10`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-3xl font-bold gradient-text">{card.value}</p>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
