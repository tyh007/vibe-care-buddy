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
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-500/10",
    },
    {
      title: "Average Mood",
      value: `${stats.averageMood}/5`,
      icon: Smile,
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500/10",
    },
    {
      title: "Weekly Goal",
      value: `${Math.round(stats.weeklyGoal)}%`,
      icon: Target,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="p-6 animate-fade-in hover-lift glass border-2 border-border/50 shadow-medium group cursor-pointer relative overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
          <div className="relative flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`w-6 h-6 bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{card.title}</p>
              <p className="text-3xl font-display font-bold text-foreground">{card.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
